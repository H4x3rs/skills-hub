const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // 站点设置
  siteTitle: { type: String, default: 'SkillHub - 智能技能市场' },
  siteDescription: { type: String, default: '连接开发者与智能技能的桥梁，让技术更易用' },

  // 安全设置
  require2FA: { type: Boolean, default: false },
  enableEmailVerification: { type: Boolean, default: false },

  // 上传设置
  maxFileSize: { type: Number, default: 50 }, // MB
  allowedFileTypes: { type: String, default: '.zip,.tar.gz,.js,.ts,.json' },

  // 维护模式
  maintenanceMode: { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'settings',
});

// 单例模式：只保留一条记录
settingsSchema.statics.get = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

settingsSchema.statics.updateSettings = async function (updates) {
  const doc = await this.get();
  const allowed = [
    'siteTitle', 'siteDescription',
    'require2FA', 'enableEmailVerification',
    'maxFileSize', 'allowedFileTypes',
    'maintenanceMode'
  ];
  for (const key of allowed) {
    if (updates[key] !== undefined) {
      doc[key] = updates[key];
    }
  }
  await doc.save();
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
