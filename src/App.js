import './App.css';
import baldric from './baldric.json';
import { useState } from 'react';

const dndSkills = {
    "Strength": ["Athletics"],
    "Dexterity": ["Acrobatics", "Sleight of Hand", "Stealth"],
    "Constitution": [],
    "Intelligence": ["Arcana", "History", "Investigation", "Nature", "Religion"],
    "Wisdom": ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
    "Charisma": ["Deception", "Intimidation", "Performance", "Persuasion"]
  };

let character = baldric; //change this based on queryParams
//console.log(Object.keys(dndSkills))
Object.keys(dndSkills).map((element) => {console.log(element)});

const generalStats = [
    { stat: character.ProficiencyBonus, description: "Proficiency Bonus" },
    { stat: character.ArmorClass, description: "Armor Class" },
    { stat: character.Initiative, description: "Initiative" },
    { stat: character.Speed, description: "Speed" },
    { stat: character.HitPoints.Max, description: "Hit Points" },
];

const roleStats = [
    { stat: `${character.Class} Level ${character.Level}`, description: "Class" },
    { stat: character.Background, description: "Background" },
    { stat: character.Race, description: "Race" },
    { stat: character.Alignment, description: "Alignment" },
];

const characterTraits = [
    { stat: character.PersonalityTraits, description: "Personality Traits" },
    { stat: character.Ideals, description: "Ideals" },
    { stat: character.Bonds, description: "Bonds" },
    { stat: character.Flaws, description: "Flaws" },
    { stat: character.Equipment.join("\n"), description: "Equipment" },
];

function StatComponent({ stat, description }) {
    const [isVisible, setVisibility, style] = useVisibility(false);

    return (
        <div>
            <div onClick={() => setVisibility(true)} className="stat" style={style}>
                {isVisible ? stat : "0"}
            </div>
            <div className="description">
                <p>{description}</p>
            </div>
        </div>
    );
};

function AttributeComponent({ attribute, description, skillproficiencies, saveproficiencies}) {
    const modifier = Math.floor((attribute - 10) / 2);
    //console.log(saveproficiencies.includes("Wisdom"));
    
    return (
        <div className="attribute">
            <div>
                <span className="modifier">{modifier}</span>
                <span className="core-stat">{attribute}</span>
                <span className="description">{description}</span>
            </div>
            <ul>
                <SkillComponent
                        skillStat={saveproficiencies.includes(attribute) ? modifier + character.ProficiencyBonus : modifier}
                        skillName= "Saving Throw"
                />
                {dndSkills[description].map((element, index) =>{
                    return(
                        <SkillComponent
                        skillStat={skillproficiencies.includes(element) ? modifier + character.ProficiencyBonus : modifier}
                        skillName={element}
                        />
                    )
                })}
            </ul>
        </div>
    );
};

function SkillComponent({skillStat, skillName}) {
    return (
        <li>
            <span className="stat-horizontal">
                {skillStat}
            </span>
            <span>{skillName}</span>
        </li>
    );
};

function useVisibility(initial = false) {
    const [isVisible, setVisibility] = useState(initial);

    const style = isVisible ? {} : {
        backgroundColor: "black",
        cursor: "pointer",
    };

    return [isVisible, setVisibility, style];
};

function App() {
    return (
        <div className="App">
            <header>
                <section id="nameContainer">
                    <StatComponent stat={character.CharacterName} description="Character Name" />
                </section>
                <section id="roleContainer">
                    {roleStats.map(element => (
                        <StatComponent stat={element.stat} description={element.description} />
                    ))}
                </section>
            </header>
            <main>
                <section id="left">
                    <section id="generalStats">
                        {generalStats.map(element => (
                            <StatComponent stat={element.stat} description={element.description} />
                        ))}
                    </section>

                    <section id="leftBottom">
                        <section id="attributeSection">
                            {Object.keys(dndSkills).map((element) =>  (
                                //console.log(element);
                                
                                <AttributeComponent
                                    attribute={character.Attributes[element]}
                                    description={element}
                                    skillproficiencies={character.SkillProficiencies}
                                    saveproficiencies={character.SaveProficiencies}
                                />
                            ))}
                        </section>
                        <section id="characterTraits">
                            {characterTraits.map(element => (
                                <StatComponent stat={element.stat} description={element.description} />
                            ))}
                        </section>
                    </section>
                </section>
                <section id="right">

                </section>
            </main>
        </div>
    );
}

export default App;
