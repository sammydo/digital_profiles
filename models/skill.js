var mongoose = require('mongoose');

var SkillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true
  },
  skillType: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Skill', SkillSchema);
