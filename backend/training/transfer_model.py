import torch
import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights


class GalaxyResNet(nn.Module):
    def __init__(self, num_classes=4):
        super().__init__()

        self.model = resnet18(
            weights=ResNet18_Weights.DEFAULT
        )

        self.model.fc = nn.Linear(
            self.model.fc.in_features,
            num_classes
        )

    def forward(self, x):
        return self.model(x)

    def get_embedding(self, x):
        """
        Extract the 512-dimensional feature representation
        before the final classification layer.
        """

        x = self.model.conv1(x)
        x = self.model.bn1(x)
        x = self.model.relu(x)
        x = self.model.maxpool(x)

        x = self.model.layer1(x)
        x = self.model.layer2(x)
        x = self.model.layer3(x)
        x = self.model.layer4(x)

        x = self.model.avgpool(x)

        x = torch.flatten(x, 1)

        return x