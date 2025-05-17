import './App.css';
import { useEffect, useState } from 'react';
import spells from './spell-links.json';
import baldric from './characters/baldric.json';
import eldin from './characters/eldin.json';

import ronai from './characters/ronai.json';

import luna from './characters/luna.json';

const params = new URLSearchParams(window.location.search);
let character = params.get("character") ?  params.get("character") : 1;
switch(character){
    default:
        character = baldric;
        break;
    case "1":
        character = baldric;
        break;
    case "2":
        character = luna;
        break;
    case "3":
        character = eldin;
        break;
    case "4":
        character = ronai;
        break;
}
let revealedSpells =[];

const dndSkills = {
    "Strength": ["Athletics"],
    "Dexterity": ["Acrobatics", "Sleight of Hand", "Stealth"],
    "Constitution": [],
    "Intelligence": ["Arcana", "History", "Investigation", "Nature", "Religion"],
    "Wisdom": ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
    "Charisma": ["Deception", "Intimidation", "Performance", "Persuasion"]
  };

const generalStats = [
    { stat: character.ProficiencyBonus, description: "Proficiency Bonus" },
    { stat: character.ArmorClass, description: "Armor Class" },
    { stat: character.Initiative, description: "Initiative" },
    { stat: character.Speed, description: "Speed" },
    { stat: character.PassiveWisdom, description: "Passive Wisdom" },
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
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);
    return (
        <div>
            <div onClick={() => setVisibility(true)} className={"stat " + hiddenClass}>
                {stat}
            </div>
            <div className="description">
                <p>{description}</p>
            </div>
        </div>
    );
};

function AttributeComponent({ attribute, description, skillproficiencies, saveproficiencies}) {
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);
    let modifier = Math.floor((attribute - 10) / 2);
    let modifierPlus = modifier > 0 ? "+" + modifier.toString() : modifier;
    let savingThrow = saveproficiencies.includes(description) ? modifier + character.ProficiencyBonus : modifier;
    return (
        <div className="attribute">
            <div>
                <div onClick={() => setVisibility(true)} className={"modifier " + hiddenClass}>
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
                {dndSkills[description].map((element) =>{
                    let bonus = character.ProficiencyBonus;
                    if(character.Expertise && character.Expertise.includes(element)) bonus = bonus*2
                    let skill = skillproficiencies.includes(element) ? modifier + bonus : modifier;
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
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);

    return (
        <li>
            <span onClick={() => setVisibility(true)} className={"stat-horizontal " + hiddenClass}>
                {isVisible? skillStat : 0}
            </span>
            <span>{skillName}</span>
        </li>
    );
};

function ProficiencyComponent({proficiency}) {
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);
    return(
        <>
            <span onClick={() => setVisibility(true)} className={"proficiency " + hiddenClass}>
                {isVisible? proficiency : "No item"}
            </span>
        </>
    );
};

function TraitsComponent({traitName, traitDescription}) {
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);
    if(Array.isArray(traitDescription)){
        traitDescription = traitDescription.map(element => {
            if(isVisible) revealedSpells.push(element)
                return(
                <>
                    <a href={spells[element][1]} target="_blank" rel="noreferrer">
                        {element}
                    </a>
                    <br />
                </>
            )
        });
    };
    return(
        <>
            <span onClick={() => setVisibility(true)} className={"trait " + hiddenClass}>
                <span>
                    {isVisible && ("• " + traitName)}
                </span>
            <br/>
                {isVisible? traitDescription : "No item"}
            </span>
        </>
    );
};

function SpellcastingComponent({spellCastObject, toggleSpellList}) {
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);
    return(
        <div onClick={() => setVisibility(true)} className={"trait " + hiddenClass}>
            <span>
                <b>• Spellcasting</b>
            </span>
            <br />
            {Object.keys(spellCastObject).map(element => {
                if(typeof spellCastObject[element] === "object"){
                    return(
                        <>
                            {isVisible &&
                            <span className='toggleModal' onClick={toggleSpellList}>
                                Prepared Spells
                            </span>
                        }
                        </>
                    )
                }else{
                    return(
                        <>
                        <span>
                            <b>{element}:</b> {spellCastObject[element]}
                        </span>
                        <br />
                        </>
                    )
                }
            })}
            <br />
        </div>
    );
};

function SpellList({ spellsObject, showSpellList, toggleSpellList }) {
    return (
        <>
            {showSpellList && (
                <div id="spellList">
                    <div onClick={toggleSpellList} className="icon">
                        <img src='./close-icon.png' alt="close" />
                    </div>
                    <div className='spellLvl'>
                        {Object.keys(spellsObject).map((spellList, index) =>  {
                            return(
                                <div>
                                    <p>{ Object.keys(spellsObject)[index] === "0" ? "Cantrips" : "Level " + Object.keys(spellsObject)[index] + " Spells"}</p>
                                    {
                                        spellsObject[spellList].map((element) => {
                                            return(<Spell item={element} />)
                                        })
                                    }
                                </div>
                            )
                         })}
                    </div>
                </div>
             )}
        </>
    );
};

function Spell({item}){
    const [isVisible, setVisibility, hiddenClass] = useVisibility(false);
      useEffect(() => {
    if (revealedSpells.includes(item)) {
      setVisibility(true);
    }
  }, [revealedSpells, item]);
    return(
        <span onClick={() => {setVisibility(true); revealedSpells.push(item);}} className={hiddenClass}>
            {isVisible?
                <a href={spells[item][1]} target="_blank" rel="noreferrer">{item}</a>
                : "no item"
            }
            <br />
        </span>
    )
}

const useVisibility = (initial = false) => {
    const [isVisible, setVisibility] = useState(initial);
    const hiddenClass = isVisible ? "" : "hidden";
    return [isVisible, setVisibility, hiddenClass];
};

function App() {
    const [showSpellList, setShowSpellList] = useState(false);
    const toggleSpellList = () => {
        setShowSpellList(prev => !prev);
    };
    return (
        <div className="App">
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
                                <div className='description'>Proficiencies and languages</div>
                            </div>
                            <div>
                                {Object.keys(character.FeaturesAndTraits).map((element) => (
                                    <TraitsComponent traitName={element} traitDescription={character.FeaturesAndTraits[element]}/>
                                ))}
                                {character.Spellcaster === true ?
                                    <SpellcastingComponent
                                        spellCastObject={character.Spellcasting}
                                        toggleSpellList={toggleSpellList}
                                    />
                                    : ""
                                }
                                <div className='description'>Features and traits</div>
                            </div>
                        </section>
                    </main>
                {character.Spellcaster === true ?
                    <SpellList
                        spellsObject={character.Spellcasting.PreparedSpells}
                        showSpellList={showSpellList} toggleSpellList={toggleSpellList}
                    />
                    : ""
                }
                </div>
            </div>
        </div>
    );
}

export default App;
