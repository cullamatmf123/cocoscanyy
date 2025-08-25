import os
import sys
import shutil
import tensorflow as tf

def convert_model_for_cocoscan():
    """
    Convert the trained TensorFlow model to TensorFlow.js format for cocoscan app
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
    
    # Install tensorflowjs if needed
    try:
        import tensorflowjs as tfjs
        print("✓ tensorflowjs is available")
    except ImportError:
        print("📦 Installing tensorflowjs...")
        os.system("pip install tensorflowjs")
        try:
            import tensorflowjs as tfjs
            print("✓ tensorflowjs installed successfully")
        except ImportError:
            print("❌ Failed to install tensorflowjs")
            return False
    
    # Create cocoscan assets directory
    os.makedirs(cocoscan_assets_path, exist_ok=True)
    os.makedirs(cocoscan_model_path, exist_ok=True)
    
    print("🔄 Converting SavedModel to TensorFlow.js format...")
    
    try:
        # Convert SavedModel to TensorFlow.js
        tfjs.converters.convert_tf_saved_model(
            saved_model_path,
            cocoscan_model_path,
            signature_name='serving_default',
            saved_model_tags='serve'
        )
        
        print(f"✅ Model successfully converted!")
        print(f"📁 Output directory: {cocoscan_model_path}")
        
        # List generated files
        print("\n📄 Generated files:")
        for file in os.listdir(cocoscan_model_path):
            file_path = os.path.join(cocoscan_model_path, file)
            file_size = os.path.getsize(file_path)
            print(f"  - {file} ({file_size:,} bytes)")
        
        # Copy labels.txt to cocoscan assets
        if os.path.exists(labels_path):
            cocoscan_labels_path = os.path.join(cocoscan_assets_path, "labels.txt")
            shutil.copy2(labels_path, cocoscan_labels_path)
            print(f"✅ Labels file copied to: {cocoscan_labels_path}")
        
        # Update the health classification service with local model path
        update_service_config(cocoscan_path, cocoscan_model_path)
        
        print("\n🎉 Integration Complete!")
        print("\n📱 Next steps:")
        print("1. cd C:\\Users\\steph\\OneDrive\\Desktop\\cocoscan")
        print("2. npm install  # Install new TensorFlow.js dependencies")
        print("3. npx expo start  # Launch the app")
        print("\n💡 The app will now classify images as Healthy/Unhealthy!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting model: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Ensure the SavedModel was created successfully")
        print("2. Check that you have sufficient disk space")
        print("3. Verify TensorFlow and tensorflowjs versions are compatible")
        return False

def update_service_config(cocoscan_path, model_path):
    """Update the health classification service with the correct model path"""
    
    service_file = os.path.join(cocoscan_path, "app", "lib", "healthClassificationService.ts")
    
    if not os.path.exists(service_file):
        print("⚠️  Health classification service not found - please ensure it was created")
        return
    
    try:
        # Read the current service file
        with open(service_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the placeholder URL with local asset path
        # For Expo, we'll use a local asset URL
        local_model_url = './assets/model/model.json'
        
        # Update the MODEL_URL
        updated_content = content.replace(
            "private readonly MODEL_URL = 'https://your-model-url/model.json';",
            f"private readonly MODEL_URL = '{local_model_url}';"
        )
        
        # Write back the updated content
        with open(service_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✅ Updated service configuration to use local model")
        
    except Exception as e:
        print(f"⚠️  Could not update service config: {e}")
        print("Please manually update the MODEL_URL in healthClassificationService.ts")

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
    
    # Check if TensorFlow.js dependencies are added
    with open(package_json, 'r') as f:
        content = f.read()
        if '@tensorflow/tfjs' not in content:
            print("⚠️  TensorFlow.js dependencies not found in package.json")
            print("Please update package.json with TensorFlow.js dependencies")
            return False
    
    print("✅ Cocoscan project setup looks good")
    return True

if __name__ == "__main__":
    print("🚀 Cocoscan Health Classification Integration")
    print("=" * 50)
    
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
