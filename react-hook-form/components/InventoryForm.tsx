import { useFieldArray, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function InventoryForm() {
    const { register, control } = useFormContext()
    const { fields: weapons, append: appendWeapon, remove: removeWeapon } = useFieldArray({
        control,
        name: "inventory.weapons"
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inventory</h3>
            <div>
                <h4 className="text-md font-medium mb-2">Weapons</h4>
                {weapons.map((weapon, index) => (
                    <div key={weapon.id} className="flex items-center space-x-2 mb-2">
                        <Input {...register(`inventory.weapons.${index}.name`)} placeholder="Weapon name" />
                        <Input
                            {...register(`inventory.weapons.${index}.damage`, { valueAsNumber: true })}
                            type="number"
                            placeholder="Damage"
                        />
                        <Button type="button" variant="destructive" onClick={() => removeWeapon(index)}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => appendWeapon({ name: "", damage: 0 })}
                    className="mt-2"
                >
                    Add Weapon
                </Button>
            </div>
            <div>
                <h4 className="text-md font-medium mb-2">Armor</h4>
                <div className="flex items-center space-x-2">
                    <Input {...register("inventory.armor.name")} placeholder="Armor name" />
                    <Input
                        {...register("inventory.armor.defense", { valueAsNumber: true })}
                        type="number"
                        placeholder="Defense"
                    />
                </div>
            </div>
        </div>
    )
}
