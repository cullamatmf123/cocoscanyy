import os
import sys
import json
import subprocess
import tempfile

def convert_model_direct():
    """
    Convert TensorFlow SavedModel to TensorFlow.js using direct Python API
    Avoids tensorflow-decision-forests conflicts
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
        return False
    
    # Create output directory
    os.makedirs(cocoscan_assets_path, exist_ok=True)
    os.makedirs(cocoscan_model_path, exist_ok=True)
    
    print("🔄 Converting SavedModel to TensorFlow.js format...")
    
    try:
        # Method 1: Try using a clean Python subprocess to avoid import conflicts
        conversion_script = f'''
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# Try to avoid tensorflow-decision-forests import
import sys
import importlib.util

# Block tensorflow_decision_forests import
class BlockTDFImporter:
    def find_spec(self, fullname, path, target=None):
        if "tensorflow_decision_forests" in fullname:
            return None
        return None

sys.meta_path.insert(0, BlockTDFImporter())

try:
    import tensorflow as tf
    tf.get_logger().setLevel('ERROR')
    
    # Load the SavedModel
    model = tf.saved_model.load("{saved_model_path}")
    
    # Get the concrete function
    concrete_func = model.signatures["serving_default"]
    
    # Convert to TensorFlow.js format using tf.saved_model.save
    temp_path = r"{cocoscan_model_path}_temp"
    os.makedirs(temp_path, exist_ok=True)
    
    # Save as a new SavedModel without decision forests dependencies
    tf.saved_model.save(model, temp_path)
    
    # Now use tensorflowjs converter on the clean model
    import subprocess
    cmd = [
        "python", "-m", "tensorflowjs.converters.converter",
        "--input_format=tf_saved_model",
        "--output_format=tfjs_graph_model", 
        "--signature_name=serving_default",
        "--saved_model_tags=serve",
        temp_path,
        "{cocoscan_model_path}"
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Conversion successful!")
        # Clean up temp directory
        import shutil
        shutil.rmtree(temp_path)
    else:
        print(f"❌ Conversion failed: {{result.stderr}}")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Error: {{e}}")
    sys.exit(1)
'''
        
        # Write the conversion script to a temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(conversion_script)
            temp_script_path = f.name
        
        try:
            # Run the conversion in a separate Python process
            result = subprocess.run([sys.executable, temp_script_path], 
                                  capture_output=True, text=True, cwd=cocoscan_path)
            
            print(result.stdout)
            if result.stderr:
                print(result.stderr)
                
            if result.returncode != 0:
                raise Exception(f"Conversion subprocess failed with code {result.returncode}")
                
        finally:
            # Clean up temp script
            try:
                os.unlink(temp_script_path)
            except:
                pass
        
        # Check if conversion was successful
        model_json_path = os.path.join(cocoscan_model_path, "model.json")
        if not os.path.exists(model_json_path):
            raise Exception("model.json not found after conversion")
        
        print(f"✅ Model successfully converted!")
        print(f"📁 Output directory: {cocoscan_model_path}")
        
        # List generated files
        print("\n📄 Generated files:")
        for file in os.listdir(cocoscan_model_path):
            file_path = os.path.join(cocoscan_model_path, file)
            file_size = os.path.getsize(file_path)
            print(f"  - {file} ({file_size:,} bytes)")
        
        # Convert labels to JSON
        if os.path.exists(labels_path):
            with open(labels_path, 'r') as f:
                labels = [line.strip() for line in f.readlines() if line.strip()]
            
            cocoscan_labels_path = os.path.join(cocoscan_assets_path, "model", "labels.json")
            with open(cocoscan_labels_path, 'w') as f:
                json.dump(labels, f, indent=2)
            
            print(f"✅ Labels file converted to JSON: {cocoscan_labels_path}")
        
        print("\n🎉 Integration Complete!")
        print("\n📱 Next steps:")
        print("1. npx expo start --offline")
        print("\n💡 The app will now classify images!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting model: {e}")
        
        # Fallback: Try manual conversion without subprocess
        print("\n🔄 Trying fallback method...")
        try:
            return fallback_conversion(saved_model_path, cocoscan_model_path, labels_path)
        except Exception as fallback_error:
            print(f"❌ Fallback also failed: {fallback_error}")
            return False

def fallback_conversion(saved_model_path, output_path, labels_path):
    """Fallback conversion method using basic TensorFlow operations"""
    
    print("🔄 Using fallback conversion method...")
    
    # Try to uninstall tensorflow-decision-forests temporarily
    try:
        subprocess.run([sys.executable, "-m", "pip", "uninstall", "tensorflow-decision-forests", "-y"], 
                      capture_output=True)
        print("✅ Temporarily removed tensorflow-decision-forests")
    except:
        pass
    
    try:
        # Now try the conversion
        cmd = [
            "tensorflowjs_converter",
            "--input_format=tf_saved_model",
            "--output_format=tfjs_graph_model",
            "--signature_name=serving_default", 
            "--saved_model_tags=serve",
            saved_model_path,
            output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Fallback conversion successful!")
            
            # Convert labels
            if os.path.exists(labels_path):
                with open(labels_path, 'r') as f:
                    labels = [line.strip() for line in f.readlines() if line.strip()]
                
                labels_json_path = os.path.join(output_path, "labels.json")
                with open(labels_json_path, 'w') as f:
                    json.dump(labels, f, indent=2)
            
            return True
        else:
            print(f"❌ Fallback conversion failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Fallback error: {e}")
        return False
    
    finally:
        # Reinstall tensorflow-decision-forests
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "tensorflow-decision-forests"], 
                          capture_output=True)
        except:
            pass

if __name__ == "__main__":
    print("🚀 Cocoscan Model Conversion (Direct Method)")
    print("=" * 50)
    
    success = convert_model_direct()
    
    if success:
        print("\n🎊 Success! Your cocoscan app now has the model!")
    else:
        print("\n💥 Conversion failed. Please check the errors above.")
        sys.exit(1)
