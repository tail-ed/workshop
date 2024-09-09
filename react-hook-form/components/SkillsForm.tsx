import { useFieldArray, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function SkillsForm() {
    const { register, control } = useFormContext()
    const { fields: skills, append: appendSkill, remove: removeSkill } = useFieldArray({
        control,
        name: "skills"
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            {skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center space-x-2 mb-2">
                    <Input {...register(`skills.${index}.name`)} placeholder="Skill name" />
                    <Input
                        {...register(`skills.${index}.level`, { valueAsNumber: true })}
                        type="number"
                        placeholder="Level"
                    />
                    <Button type="button" variant="destructive" onClick={() => removeSkill(index)}>
                        Remove
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                onClick={() => appendSkill({ name: "", level: 1 })}
            >
                Add Skill
            </Button>
        </div>
    )
}
