import { ItemRecipe } from '../ItemRecipe';
import { CoralScales } from './CoralScales';
import { Item } from '../Item';
import { DragonWhelpClaws } from './DragonWhelpClaws';
import { ItemLabel } from '../ItemLabel';

export class DragonScales extends ItemRecipe {
    private readonly dragonWhelpClaws: DragonWhelpClaws;
    private readonly coralScales: CoralScales;
    public readonly recipe: Item[];
    public readonly itemId: number = FourCC('I02H');
    public readonly name: string = 'Dragon Scales';
    public readonly labels: ItemLabel[] = [ItemLabel.AGILITY, ItemLabel.MAX_HEALTH];
    public readonly goldCost: number = 350;
    public readonly iconPath: string = 'ReplaceableTextures\\CommandButtons\\BTNCreatureCarapace.tga';
    public readonly description: string = `These scales are deadly sharp

|cffffcc00Max health:|r +345
|cffffcc00Agility:|r +15

|cFF808080Agility increases your attack and movement speed.|r`;

    constructor(dragonWhelpClaws: DragonWhelpClaws, coralScales: CoralScales) {
        super();

        this.dragonWhelpClaws = dragonWhelpClaws;
        this.coralScales = coralScales;
        this.recipe = [this.dragonWhelpClaws, this.coralScales];
    }
}
