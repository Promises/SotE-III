import { ItemRecipe } from '../ItemRecipe';
import { IronSword } from '../BasicItems/IronSword';
import { Item } from '../Item';
import { LoadedRifle } from './LoadedRifle';
import { ItemLabel } from '../ItemLabel';

export class LoadedCannon extends ItemRecipe {
    private readonly loadedRifle: LoadedRifle;
    private readonly ironSword: IronSword;
    public readonly recipe: Item[];
    public readonly itemId: number = FourCC('I00X');
    public readonly name: string = 'Loaded Cannon';
    public readonly labels: ItemLabel[] = [ItemLabel.ATTACK_DAMAGE];
    public readonly goldCost: number = 150;
    public readonly iconPath: string = 'ReplaceableTextures\\CommandButtons\\BTNHumanMissileUpTwo.blp';
    public readonly description: string = `Make your enemies tremble!

|cffffcc00Attack damage:|r +12
|cffffcc00Effect:|r Your physical attacks now deal 10% of the initial damage as splash damage in an area of 200 around the target.

|cFF808080Agility increases your attack and movement speed.|r`;

    constructor(loadedRifle: LoadedRifle, ironSword: IronSword) {
        super();

        this.loadedRifle = loadedRifle;
        this.ironSword = ironSword;
        this.recipe = [this.loadedRifle, this.ironSword];
    }
}
