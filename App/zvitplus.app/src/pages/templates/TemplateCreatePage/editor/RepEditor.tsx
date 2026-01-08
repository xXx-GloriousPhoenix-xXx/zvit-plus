// editor/RepEditor.tsx
import type { RepTemplate, RepElement } from "./types";
import { v4 as uuid } from "uuid";

interface Props {
    template: RepTemplate;
    onChange: (t: RepTemplate) => void;
}

export function RepEditor({ template, onChange }: Props) {
    const addText = () => {
        const el: RepElement = {
            id: uuid(),
            type: "text",
            position: { x: 50, y: 50 },
            size: { width: 100, height: 100 },
            payload: { text: "New text" }
        };

        onChange({
            ...template,
            elements: [...template.elements, el]
        });
    };

    return (
        <div style={{ display: "flex" }}>
            <aside>
                <button onClick={addText}>Add text</button>
            </aside>

            <div
                style={{
                    width: 794,
                    height: 1123,
                    border: "1px solid #ccc",
                    position: "relative"
                }}
            >
                {template.elements.map(el => (
                    <div
                        key={el.id}
                        style={{
                            position: "absolute",
                            left: el.position.x,
                            top: el.position.y
                        }}
                    >
                        {el.type === "text" && el.payload?.text ? "True" : "False"}
                    </div>
                ))}
            </div>
        </div>
    );
}
