import './App.css';
import spells from './spell-links.json';
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
                {stat}
            </div>
            <div className="description">
                <p>{description}</p>
            </div>
        </div>
    );
};

function AttributeComponent({ attribute, description, skillproficiencies, saveproficiencies}) {
    const [isVisible, setVisibility, style] = useVisibility(false);
    let modifier = Math.floor((attribute - 10) / 2);
    let modifierPlus = modifier > 0 ? "+" + modifier.toString() : modifier;
    let savingThrow = saveproficiencies.includes(attribute) ? modifier + character.ProficiencyBonus : modifier;
    return (
        <div className="attribute">
            <div>
                <div onClick={() => setVisibility(true)} className="modifier" style={style}>
                    <span>{isVisible? modifierPlus : 0}</span>
                    <br/>
                    <span className="core-stat">{isVisible? attribute : "+0"}</span>
                </div>

                <span className="description">{description}</span>
            </div>
            <ul>
                <SkillComponent
                        skillStat={savingThrow > 0 ? "+" + savingThrow.toString() : savingThrow}
                        skillName= "Saving Throw"
                />
                {dndSkills[description].map((element, index) =>{
                    let skill = skillproficiencies.includes(element) ? modifier + character.ProficiencyBonus : modifier;
                    return(
                        <SkillComponent
                            skillStat={skill > 0 ? "+" + skill.toString() : skill}
                            skillName={element}
                        />
                    )
                })}
            </ul>
        </div>
    );
};

function SkillComponent({skillStat, skillName}) {
    const [isVisible, setVisibility, style] = useVisibility(false);

    return (
        <li>
            <span onClick={() => setVisibility(true)} className="stat-horizontal" style={style}>
                {isVisible? skillStat : 0}
            </span>
            <span>{skillName}</span>
        </li>
    );
};

function ProficiencyComponent({proficiency}) {
    const [isVisible, setVisibility, style] = useVisibility(false);
    return(
        <>
            <span onClick={() => setVisibility(true)} style={style}>
                {isVisible? proficiency : "No item"}
            </span>
        </>
    );
};

function TraitsComponent({traitName, traitDescription}) {
    const [isVisible, setVisibility, style] = useVisibility(false);
    if(Array.isArray(traitDescription)){
        traitDescription = traitDescription.map(element => (
            <>
                <a href={spells[element][1]} target="_blank" rel="noreferrer">
                    {element}
                </a>
                <br />
            </>
        ));
    };
    return(
        <>
            <span onClick={() => setVisibility(true)} style={style}>
                <span>
                    {isVisible && ("• " + traitName + ": ")}
                </span>
            <br/>
                {isVisible? traitDescription : "No item"}
            </span>
        </>
    );
};

function SpellcastingComponent({mana, saveDC, attackMod}) {
    const [isVisible, setVisibility, style] = useVisibility(false);
    return(
        <div onClick={() => setVisibility(true)} style={style}>
            <span>
                <b>• Spellcasting</b>
            </span>
            <br />
            <span>
                <b>Mana:</b> {mana}
            </span>
            <br />
            <span>
                <b>Spell Save DC:</b> {saveDC}
            </span>
            <br />
            <span>
                <b>Spell Attack Modifier:</b> {attackMod}
            </span>
            <br />
            <span className='toggleModal'>
                Spell List
            </span>
            <br />
        </div>
    );
};


function Container1({}) {
    return (
        <div id="container1">
            <div>
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
                        <div>
                            {character.ProficienciesAndLanguages.map(element => (
                                <ProficiencyComponent proficiency={element} />
                            ))}
                            <div className='description'>Proficientes and languages</div>
                        </div>
                        <div>
                            {Object.keys(character.FeaturesAndTraits).map((element) => (
                                <TraitsComponent traitName={element} traitDescription={character.FeaturesAndTraits[element]}/>
                            ))}
                            {character.Spellcaster === true ?
                                <SpellcastingComponent mana={character.Spellcasting.Slots} attackMod={character.Spellcasting['Spell Attack Modifier']} saveDC={character.Spellcasting['Spell Save DC']} />
                                : ""
                            }
                            <div className='description'>Features and traits</div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

function Container2({}) {
    const [isActive, setActive, style] = useActive(false);
    return (
        <div id="container2">

        </div>
    );
};

const useVisibility = (initial = false) => {
    const [isVisible, setVisibility] = useState(initial);
    const style = isVisible ? {} : {
        backgroundColor: "black",
        cursor: "pointer",
        webkitUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none"
    };
    return [isVisible, setVisibility, style];
};

const  useActive = (initial = false) =>{
    const [isActive, setActive] = useState(initial);
        const style = isActive ? {} : {
        display: "none"
    };
    return [isActive, setActive, style];
}

function App() {
    return (
        <div className="App">
            <Container1 />
            <Container2 />
        </div>
    );
}

export default App;
