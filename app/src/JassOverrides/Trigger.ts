import { Log } from '../lib/Serilog/Serilog';

export class Trigger {
    private readonly nativeTrigger: trigger;

    constructor() {
        this.nativeTrigger = CreateTrigger();
    }

    public static EvaluateCondition(func: () => boolean): boolean {
        let answer: boolean = false;

        xpcall(() => {
            answer = func();
        },
               (err: any) => {
                   this.printError(err);
               });

        return answer;
    }

    public static printError(err: any): void {
        Log.Fatal(err);
    }

    public AddAction(actionFunc: () => void): triggeraction {
        return TriggerAddAction(this.nativeTrigger, () => xpcall(() => actionFunc(), err => Trigger.printError(err)));

    }

    public RegisterTimerEvent(timeout: number, periodic: boolean): event {
        return TriggerRegisterTimerEvent(this.nativeTrigger, timeout, periodic);
    }

    public RegisterTimerEventSingle(timeout: number): event {
        return TriggerRegisterTimerEventSingle(this.nativeTrigger, timeout);
    }

    public RegisterTimerEventPeriodic(timeout: number): event {
        return TriggerRegisterTimerEventPeriodic(this.nativeTrigger, timeout);
    }

    public RegisterPlayerStateEvent(whichPlayer: player, whichState: playerstate, opcode: limitop, limitval: number): event {
        return TriggerRegisterPlayerStateEvent(this.nativeTrigger, whichPlayer, whichState, opcode, limitval);
    }

    public RegisterDeathEvent(whichWidget: widget): event {
        return TriggerRegisterDeathEvent(this.nativeTrigger, whichWidget);
    }

    public RegisterDialogEventBJ(whichDialog: dialog): event {
        return TriggerRegisterDialogEventBJ(this.nativeTrigger, whichDialog);
    }


    public RegisterEnterRectSimple(r: rect): event {
        return TriggerRegisterEnterRectSimple(this.nativeTrigger, r);
    }

    public AddCondition(func: () => boolean): triggercondition {
        return TriggerAddCondition(this.nativeTrigger, Condition(() => Trigger.EvaluateCondition(func)));
    }

    public AddFilterFuncCondition(filter: filterfunc): triggercondition {
        return TriggerAddCondition(this.nativeTrigger, filter);
    }

    public RegisterAnyUnitEventBJ(whichEvent: playerunitevent): void {
        TriggerRegisterAnyUnitEventBJ(this.nativeTrigger, whichEvent);
    }

    public RegisterPlayerChatEvent(whichPlayer: player, chatMessageToDetect: string, exactMatchOnly: boolean): event {
        return TriggerRegisterPlayerChatEvent(this.nativeTrigger, whichPlayer, chatMessageToDetect, exactMatchOnly);
    }

    public RegisterPlayerUnitEventSimple(whichPlayer: player, whichEvent: playerunitevent): event {
        return TriggerRegisterPlayerUnitEventSimple(this.nativeTrigger, whichPlayer, whichEvent);
    }
}
