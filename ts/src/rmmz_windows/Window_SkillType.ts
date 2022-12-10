//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

class Window_SkillType extends Window_Command {
    protected _actor!: Game_Actor | null;
    protected _skillWindow!: Window_SkillList;

    initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this._actor = null;
    }

    setActor(actor: any) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    }

    makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.skillTypes();
            for (const stypeId of skillTypes) {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
    }

    update() {
        Window_Command.prototype.update.call(this);
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    }

    setSkillWindow(skillWindow: any) {
        this._skillWindow = skillWindow;
    }

    selectLast() {
        const skill = this._actor!.lastMenuSkill() as RMMZData.Item;
        if (skill) {
            this.selectExt(skill.stypeId);
        } else {
            this.forceSelect(0);
        }
    }
}
