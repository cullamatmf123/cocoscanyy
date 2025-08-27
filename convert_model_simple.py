import os
import sys
import shutil
import subprocess

def convert_model_for_cocoscan():
    """
    Convert the trained TensorFlow model to TensorFlow.js format for cocoscan app
    Uses a simplified approach to avoid TensorFlow Decision Forests issues
    """
    
    # Paths
    tf_project_path = r"C:\Users\steph\CascadeProjects\tf_image_classifier"
    cocoscan_path = r"C:\Users\steph\OneDrive\Desktop\cocoscan"
    
    saved_model_path = os.path.join(tf_project_path, "exported_model", "saved_model")
    labels_path = os.path.join(tf_project_path, "exported_model", "labels.txt")
    
    cocoscan_assets_path = os.path.join(cocoscan_path, "assets")
    cocoscan_model_path = os.path.join(cocoscan_assets_path, "model")
    
    # Check if SavedModel exists
    if not os.path.exists(saved_model_path):
        print(f"❌ SavedModel not found at: {saved_model_path}")
        print("Please run the following commands first:")
        print(f"cd {tf_project_path}")
        print("python create_sample_dataset.py")
        print("python train_model.py")
        return False
    
    # Create cocoscan assets directory
    os.makedirs(cocoscan_assets_path, exist_ok=True)
    os.makedirs(cocoscan_model_path, exist_ok=True)
    
    print("🔄 Converting SavedModel to TensorFlow.js format...")
    
    try:
        # Use tensorflowjs_converter command line tool to avoid import issues
        cmd = [
            "tensorflowjs_converter",
            "--input_format=tf_saved_model",
            "--output_format=tfjs_graph_model",
            "--signature_name=serving_default",
            "--saved_model_tags=serve",
            saved_model_path,
            cocoscan_model_path
        ]
        
        print(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"❌ Conversion failed: {result.stderr}")
            # Try installing tensorflowjs if not found
            if "not found" in result.stderr.lower() or "not recognized" in result.stderr.lower():
                print("📦 Installing tensorflowjs...")
                subprocess.run([sys.executable, "-m", "pip", "install", "tensorflowjs"], check=True)
                print("✅ tensorflowjs installed, retrying conversion...")
                result = subprocess.run(cmd, capture_output=True, text=True)
                
                if result.returncode != 0:
                    print(f"❌ Conversion still failed: {result.stderr}")
                    return False
        
        print(f"✅ Model successfully converted!")
        print(f"📁 Output directory: {cocoscan_model_path}")
        
        # List generated files
        print("\n📄 Generated files:")
        for file in os.listdir(cocoscan_model_path):
            file_path = os.path.join(cocoscan_model_path, file)
            file_size = os.path.getsize(file_path)
            print(f"  - {file} ({file_size:,} bytes)")
        
        # Copy labels.txt and convert to JSON format for easier use in React Native
        if os.path.exists(labels_path):
            # Read labels and create JSON format
            with open(labels_path, 'r') as f:
                labels = [line.strip() for line in f.readlines() if line.strip()]
            
            cocoscan_labels_path = os.path.join(cocoscan_assets_path, "model", "labels.json")
            import json
            with open(cocoscan_labels_path, 'w') as f:
                json.dump(labels, f, indent=2)
            
            print(f"✅ Labels file converted to JSON: {cocoscan_labels_path}")
        
        print("\n🎉 Integration Complete!")
        print("\n📱 Next steps:")
        print("1. npm install --legacy-peer-deps  # Install dependencies with legacy resolver")
        print("2. npx expo start --offline  # Launch the app in offline mode")
        print("\n💡 The app will now classify images as Healthy/Unhealthy!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting model: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Ensure the SavedModel was created successfully")
        print("2. Check that you have sufficient disk space")
        print("3. Try: pip install tensorflowjs --upgrade")
        return False

def check_cocoscan_setup():
    """Check if cocoscan project is properly set up"""
    
    cocoscan_path = r"C:\Users\steph\OneDrive\Desktop\cocoscan"
    
    if not os.path.exists(cocoscan_path):
        print(f"❌ Cocoscan project not found at: {cocoscan_path}")
        return False
    
    package_json = os.path.join(cocoscan_path, "package.json")
    if not os.path.exists(package_json):
        print("❌ package.json not found in cocoscan project")
        return False
    
    print("✅ Cocoscan project setup looks good")
    return True

if __name__ == "__main__":
    print("🚀 Cocoscan Health Classification Integration (Simplified)")
    print("=" * 60)
    
    # Check cocoscan setup
    if not check_cocoscan_setup():
        print("\n❌ Please fix cocoscan setup issues first")
        sys.exit(1)
    
    # Convert and integrate model
    success = convert_model_for_cocoscan()
    
    if success:
        print("\n🎊 Success! Your cocoscan app now has health classification!")
    else:
        print("\n💥 Integration failed. Please check the errors above.")
        sys.exit(1)
