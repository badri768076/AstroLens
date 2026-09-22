import torch
import torch.nn as nn
import torch.optim as optim

from training.dataset import train_loader, val_loader
from training.transfer_model import GalaxyResNet


# --------------------------------------------------
# 1. Device
# --------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", device)

if device.type == "cuda":
    print("GPU:", torch.cuda.get_device_name(0))


# --------------------------------------------------
# 2. Model
# --------------------------------------------------

model = GalaxyResNet(num_classes=4)
model = model.to(device)


# --------------------------------------------------
# 3. Loss and optimizer
# --------------------------------------------------

criterion = nn.CrossEntropyLoss()

optimizer = optim.AdamW(
    model.parameters(),
    lr=0.0001,
    weight_decay=0.0001
)


# --------------------------------------------------
# 4. Training settings
# --------------------------------------------------

num_epochs = 10

best_val_accuracy = 0.0


# --------------------------------------------------
# 5. Training loop
# --------------------------------------------------

for epoch in range(num_epochs):

    # ==========================
    # Training
    # ==========================

    model.train()

    train_loss = 0.0
    train_correct = 0
    train_total = 0

    for images, labels in train_loader:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        train_loss += loss.item()

        _, predicted = torch.max(outputs, 1)

        train_total += labels.size(0)
        train_correct += (predicted == labels).sum().item()


    train_accuracy = 100 * train_correct / train_total
    train_loss = train_loss / len(train_loader)


    # ==========================
    # Validation
    # ==========================

    model.eval()

    val_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(outputs, labels)

            val_loss += loss.item()

            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)
            val_correct += (predicted == labels).sum().item()


    val_accuracy = 100 * val_correct / val_total
    val_loss = val_loss / len(val_loader)


    # ==========================
    # Results
    # ==========================

    print(
        f"Epoch [{epoch + 1}/{num_epochs}] "
        f"| Train Loss: {train_loss:.4f} "
        f"| Train Acc: {train_accuracy:.2f}% "
        f"| Val Loss: {val_loss:.4f} "
        f"| Val Acc: {val_accuracy:.2f}%"
    )


    # ==========================
    # Save best model
    # ==========================

    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy

        torch.save(
            model.state_dict(),
            "models/resnet18_galaxy.pth"
        )

        print(
            f"  ✓ Best ResNet model saved "
            f"(Val Acc: {val_accuracy:.2f}%)"
        )


print("\nTransfer learning complete!")
print(
    f"Best validation accuracy: "
    f"{best_val_accuracy:.2f}%"
)