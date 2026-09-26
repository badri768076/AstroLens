import torch
import torch.nn as nn
import torch.optim as optim
from torchvision.models import resnet18, ResNet18_Weights

from training.dataset import train_loader, val_loader, test_loader, class_names

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device for frozen backbone experiment:", device)

# 1. Initialize pretrained ResNet18
weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)

# 2. Freeze all backbone layers
for param in model.parameters():
    param.requires_grad = False

# 3. Replace classification head (trainable)
num_classes = len(class_names)
model.fc = nn.Linear(model.fc.in_features, num_classes)
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.fc.parameters(), lr=0.001)

num_epochs = 5
best_val_acc = 0.0

print("\n--- Training Feature Extractor (Frozen Backbone) ---")
for epoch in range(num_epochs):
    model.train()
    train_loss, train_correct, train_total = 0.0, 0, 0
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        train_loss += loss.item()
        _, predicted = torch.max(outputs, 1)
        train_total += labels.size(0)
        train_correct += (predicted == labels).sum().item()

    train_acc = 100 * train_correct / train_total
    train_loss = train_loss / len(train_loader)

    model.eval()
    val_loss, val_correct, val_total = 0.0, 0, 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()

    val_acc = 100 * val_correct / val_total
    val_loss = val_loss / len(val_loader)

    print(f"Epoch [{epoch+1}/{num_epochs}] | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}%")

    if val_acc > best_val_acc:
        best_val_acc = val_acc
        torch.save(model.state_dict(), "models/resnet18_frozen.pth")

print(f"\nBest validation accuracy (Frozen Backbone): {best_val_acc:.2f}%")

# Evaluate on held-out test set
model.load_state_dict(torch.load("models/resnet18_frozen.pth", map_location=device))
model.eval()

from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

all_preds, all_labels = [], []
with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(device)
        outputs = model(images)
        _, preds = torch.max(outputs, 1)
        all_preds.extend(preds.cpu().tolist())
        all_labels.extend(labels.tolist())

test_acc = accuracy_score(all_labels, all_preds)
macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(all_labels, all_preds, average='macro')
weighted_f1 = precision_recall_fscore_support(all_labels, all_preds, average='weighted')[2]
cm = confusion_matrix(all_labels, all_preds)

print("\n==============================")
print("FROZEN BACKBONE TEST RESULTS")
print("==============================")
print(f"Test Accuracy: {test_acc * 100:.2f}%")
print(f"Macro Precision: {macro_p * 100:.2f}%")
print(f"Macro Recall: {macro_r * 100:.2f}%")
print(f"Macro F1: {macro_f1 * 100:.2f}%")
print(f"Weighted F1: {weighted_f1 * 100:.2f}%")
print("Confusion Matrix:\n", cm)
