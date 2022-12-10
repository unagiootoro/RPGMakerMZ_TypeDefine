//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

class Window_BattleSkill extends Window_SkillList {
    initialize(rect: Rectangle) {
        Window_SkillList.prototype.initialize.call(this, rect);
        this.hide();
    }

    show() {
        this.selectLast();
        this.showHelpWindow();
        Window_SkillList.prototype.show.call(this);
    }

    hide() {
        this.hideHelpWindow();
        Window_SkillList.prototype.hide.call(this);
    }
}
