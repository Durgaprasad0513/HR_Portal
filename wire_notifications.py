import re
import os

def add_import(path, import_line):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'notification.dispatcher' not in content:
        content = content.replace("import prisma from '../../config/database';",
                                  "import prisma from '../../config/database';\n" + import_line)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

IMPORT = "import { notificationDispatcher } from '../../utils/notification.dispatcher';"

# Wire notifications into asset.service.ts
add_import('server/src/modules/assets/asset.service.ts', IMPORT)
path = 'server/src/modules/assets/asset.service.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# After asset is assigned, dispatch notification to employee
old = "      return updated;\n    });\n  }\n\n  async returnAsset"
new = """      // Notify employee
      notificationDispatcher.dispatch({
        employeeId: data.assignedEmployeeId,
        notificationType: 'ASSET_NOTIF',
        message: `An asset (${asset.brandModel || asset.assetType}) has been assigned to you.`,
        triggerEvent: 'ASSET_ASSIGNED',
        channels: ['IN_APP', 'EMAIL']
      }).catch(() => {});
      return updated;
    });
  }

  async returnAsset"""
if old in content:
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Wire notifications into performance.service.ts  
add_import('server/src/modules/performance/performance.service.ts', IMPORT)
path = 'server/src/modules/performance/performance.service.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# After HR approves appraisal, notify employee
old = "      return updated;\n    });\n  }\n}\n\nexport const performanceService"
new = """      // Notify employee of final appraisal decision
      notificationDispatcher.dispatch({
        employeeId: review.employeeId,
        notificationType: 'REVIEW_DUE',
        message: `Your performance review has been finalized with status: ${data.finalApprovalStatus}.`,
        triggerEvent: data.finalApprovalStatus,
        channels: ['IN_APP', 'EMAIL']
      }).catch(() => {});
      return updated;
    });
  }
}

export const performanceService"""
if old in content:
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Wire notifications into training.service.ts
add_import('server/src/modules/training/training.service.ts', IMPORT)
path = 'server/src/modules/training/training.service.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# After participant added, notify employee
old = "      return participant;\n    });\n  }\n\n  async removeParticipant"
new = """      // Notify employee of training assignment
      notificationDispatcher.dispatch({
        employeeId,
        notificationType: 'TRAINING_NOTIF',
        message: `You have been assigned to a training program. Please check the training portal.`,
        triggerEvent: 'TRAINING_ASSIGNED',
        channels: ['IN_APP', 'EMAIL']
      }).catch(() => {});
      return participant;
    });
  }

  async removeParticipant"""
if old in content:
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
