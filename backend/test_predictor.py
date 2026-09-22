from app.services.predictor import predict_image
from training.dataset import test_data


# Take the first image from GalaxyMNIST test set
sample = test_data[0]

image = sample["image"]
actual_label = sample["label"]


# Run AstroLens prediction
result = predict_image(image)


print("\n==============================")
print("ASTROLENS PREDICTION")
print("==============================")

print(
    "Actual class:",
    actual_label
)

print(
    "Predicted class:",
    result["class_id"]
)

print(
    "Predicted name:",
    result["class_name"]
)

print(
    f"Confidence: {result['confidence'] * 100:.2f}%"
)