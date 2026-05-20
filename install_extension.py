#!/usr/bin/env python3
import sys
import os
import json
import urllib.request
import urllib.parse
import subprocess
import platform
import ssl

def get_target_platform():
    os_name = sys.platform
    arch = platform.machine().lower()
    
    if os_name == "darwin":
        if arch in ["arm64", "aarch64"]:
            return "darwin-arm64"
        else:
            return "darwin-x64"
    elif os_name.startswith("linux"):
        if arch in ["arm64", "aarch64"]:
            return "linux-arm64"
        else:
            return "linux-x64"
    elif os_name == "win32":
        if arch in ["arm64", "aarch64"]:
            return "win32-arm64"
        else:
            return "win32-x64"
    return None

def download_and_install(extension_id):
    print(f"[*] Resolving extension '{extension_id}' on VS Code Marketplace...")
    
    # Query VS Code Marketplace API
    url = "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery"
    headers = {
        "Accept": "application/json;api-version=3.0-preview.1",
        "Content-Type": "application/json"
    }
    payload = {
        "filters": [{"criteria": [{"filterType": 7, "value": extension_id}]}],
        "flags": 914
    }
    
    # Bypass SSL errors if they occur
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            result = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"[-] Error querying marketplace API: {e}")
        return False
        
    results = result.get("results", [])
    if not results or not results[0].get("extensions"):
        print(f"[-] Extension '{extension_id}' not found on VS Code Marketplace.")
        return False
        
    extension = results[0]["extensions"][0]
    versions = extension.get("versions", [])
    
    target_platform = get_target_platform()
    print(f"[*] Detected system platform: {target_platform}")
    
    # Filter versions to find the best match for current platform
    selected_version = None
    download_url = None
    
    # First attempt: search for platform-specific version matching our platform
    for ver in versions:
        if ver.get("targetPlatform") == target_platform:
            selected_version = ver
            break
            
    # Second attempt: fallback to universal version (no targetPlatform or targetPlatform is null/empty)
    if not selected_version:
        for ver in versions:
            if not ver.get("targetPlatform") or ver.get("targetPlatform") == "universal":
                selected_version = ver
                break
                
    # Third attempt: grab the absolute latest version if none of the above are matched
    if not selected_version and versions:
        selected_version = versions[0]
        
    if not selected_version:
        print("[-] Could not resolve a compatible version for this extension.")
        return False
        
    version_number = selected_version.get("version")
    platform_info = selected_version.get("targetPlatform", "universal")
    print(f"[+] Found version {version_number} ({platform_info})")
    
    # Find the VSIX package file in the assets
    for asset in selected_version.get("files", []):
        if asset.get("assetType") == "Microsoft.VisualStudio.Services.VSIXPackage":
            download_url = asset.get("source")
            break
            
    if not download_url:
        print("[-] Could not locate VSIX package download URL.")
        return False
        
    # Download the VSIX file
    temp_filename = f"{extension_id}-{version_number}.vsix"
    print(f"[*] Downloading extension from: {download_url}")
    print(f"[*] Saving to temporary file: {temp_filename}...")
    
    try:
        # Download the file
        urllib.request.urlretrieve(download_url, temp_filename)
        print("[+] Download complete!")
    except Exception as e:
        print(f"[-] Download failed: {e}")
        # Try with a browser user-agent
        try:
            print("[*] Retrying download with User-Agent header...")
            opener = urllib.request.build_opener()
            opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
            urllib.request.install_opener(opener)
            urllib.request.urlretrieve(download_url, temp_filename)
            print("[+] Download complete (retry)!")
        except Exception as retry_err:
            print(f"[-] Retry download failed: {retry_err}")
            return False
            
    # Determine the installer binary path
    antigravity_bin = "/Applications/Antigravity IDE.app/Contents/Resources/app/bin/antigravity-ide"
    if os.path.exists(antigravity_bin):
        installer_bin = antigravity_bin
    else:
        import shutil
        if shutil.which("antigravity-ide"):
            installer_bin = "antigravity-ide"
        else:
            installer_bin = "code"

    # Install the VSIX file using the resolved command
    print(f"[*] Installing extension in Antigravity IDE using {installer_bin}...")
    try:
        process = subprocess.run(
            [installer_bin, "--install-extension", temp_filename],
            capture_output=True,
            text=True
        )
        print(process.stdout)
        if process.stderr:
            print(process.stderr)
            
        if process.returncode == 0:
            print(f"[+] Successfully installed {extension_id}!")
        else:
            print(f"[-] Installation failed with exit code: {process.returncode}")
    except Exception as e:
        print(f"[-] Failed to execute '{installer_bin} --install-extension': {e}")
        print("[!] Note: Please run the command manually:")
        print(f"    \"{installer_bin}\" --install-extension {os.path.abspath(temp_filename)}")
        
        
    # Clean up temp file
    if os.path.exists(temp_filename):
        try:
            os.remove(temp_filename)
            print("[*] Temporary file cleaned up.")
        except Exception as e:
            print(f"[!] Warning: Could not remove temporary file {temp_filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 install_extension.py <extension-id>")
        print("Example: python3 install_extension.py ms-dotnettools.csharp")
        sys.exit(1)
        
    ext_id = sys.argv[1]
    download_and_install(ext_id)
