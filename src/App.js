import './App.css';
import baldric from './baldric.json';
import { useState } from 'react';

let character = baldric
console.log(character.ProficiencyBonus);

const generalStats = [
        { stat: character.ProficiencyBonus, description: "Proficiency Bonus"},
        { stat: character.ArmorClass, description: "Armor Class"},
        { stat: character.Initiative, description: "Initiative"},
        { stat: character.Speed, description: "Speed"},
        { stat: character.HitPoints.Max, description: "Hit Points"},
    ];

const roleStats = [
    { stat: `${character.Class} Level ${character.Level}`, description: "Class"},
    { stat: character.Background, description: "Background"},
    { stat: character.Race, description: "Race"},
    { stat: character.Alignment, description: "Alignment"},
];

const characterTraits = [
    { stat: character.PersonalityTraits, description: "Personality Traits"},
    { stat: character.Ideals, description: "Ideals"},
    { stat: character.Bonds, description: "Bonds"},
    { stat: character.Flaws, description: "Flaws"},
    { stat: character.Equipment.join("<br/>"), description: "Equipment"},
];

function StatComponent({ stat, description }) {
    let [shown, setShown] = useState(false);
    let style = {};
    if(!shown){
        style.backgroundColor = "black";
        style.cursos = "pointer";
    }
    return (
        <div>
            <div onClick={() => setShown(true)} className="stat" style={style}>
                {shown? stat : "0"}
            </div>
            <div className="description">
                <p>{description}</p>
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <header>
                <section id="nameContainer">
                    <div id="name" className="stat"></div>
                    <div className="description">
                        <p>Character Name</p>
                    </div>
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
                        <div class="attribute">
                        <div>
                            <span id="dexterityMOD" class="modifier">ff</span>
                            <span id="dexterity" class="core-stat">15</span>
                            <span class="description">dexterity</span>
                        </div>
                        <ul id="dexterityList">
                        <li>
                            <span id="dexteritySave" class="stat-horizontal"><input type="radio" disabled=""/>

                            </span>
                            <label for="dexteritySave">Saving throw</label>
                        </li><li>
                        <span id="actobatics" class="stat-horizontal"><input type="radio" disabled=""/>
                            2
                        </span>
                        <label for="actobatics">actobatics</label>
                    </li><li>
                        <span id="sleightOfHand" class="stat-horizontal"><input type="radio" disabled=""/>
                            2
                        </span>
                        <label for="sleightOfHand">sleight of hand</label>
                    </li><li>
                        <span id="stealth" class="stat-horizontal"><input type="radio" disabled=""/>
                            4
                        </span>
                        <label for="stealth">stealth</label>
                    </li></ul>
                    </div>
                        </section>
                        <section id="characterTraits">
                            {characterTraits.map(element => (
                                <StatComponent stat={element.stat} description={element.description} />
                            ))}
                            <div>
                                <div id="personalityTraits" classNameName="stat"></div>
                                <div classNameName="description">
                                    <p>personality traits</p>
                                </div>
                            </div>
                            <div>
                                <div id="ideals" classNameName="stat"></div>
                                <div classNameName="description">
                                    <p>ideals</p>
                                </div>
                            </div>
                            <div>
                                <div id="bonds" classNameName="stat"></div>
                                <div classNameName="description">
                                    <p>bonds</p>
                                </div>
                            </div>
                            <div>
                                <div id="flaws" classNameName="stat"></div>
                                <div classNameName="description">
                                    <p>flaws</p>
                                </div>
                            </div>
                            <div>
                                <div id="equipment" classNameName="stat"></div>
                                <div classNameName="description">
                                    <p>equipment</p>
                                </div>
                            </div>
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
