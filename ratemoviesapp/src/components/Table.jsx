import React from "react";
import data from './data/movies.json'
import RateForm from "./RateForm";
// import 'bootstrap/dist/css/bootstrap.min.css';

function Table(){
    const [watchlist,setWatchlist] = React.useState(data)
    const [theme, setTheme] = React.useState(() => {
        const initialTheme = localStorage.getItem("theme");
        return initialTheme ? initialTheme : "";
    });

    function getThemeFromLocalStorage() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }

    function toggleTheme() {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "" ? "dark" : "";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    }
    React.useEffect(() => {
        getThemeFromLocalStorage();
    }, [theme]);
    const addRows = (data) => {
        const updatedWatchlist = [...watchlist];
        updatedWatchlist.push(data);
        setWatchlist(updatedWatchlist);
    };


    const [mode,setMode] = React.useState(true)
    function changeMode() {
        setMode(!mode);
        setThemeInStorage(!mode)
        console.log(localStorage.getItem('theme'))
    }
    const setThemeInStorage = (theme) => {
        localStorage.setItem('theme', theme)
    }
    const getThemeInStorage = (theme) => {
        const cacheTheme = localStorage.getItem('theme')
        if (cacheTheme) {

        }
    }

    return (
        <>
        <button onClick={toggleTheme} class={theme=="" ? "btn btn-dark" : "btn btn-light"}>{theme == "" ? "Switch to Dark mode" : "Switch to Light mode"}</button>
        <div className="movies">
            <table class={theme == "" ? "table table-bordered" : "table table-bordered table-dark"}>
                <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Overview</th>
                    <th scope="col">Release Date</th>
                    <th scope="col">Remark</th>
                    <th scope="col">Rating</th>
                </tr>
                </thead>
                <tbody>
                {watchlist.map((item) => { return (
                    <tr>
                        <td><div className="scrollbar">{item.moviename}</div></td>
                        <td><div class="scrollbar">{item.desc}</div></td>
                        <td>{item.releasedDate}</td>
                        <td><div class="scrollbar">{item.remark}</div></td>
                        <td>{item.rate}</td>
                    </tr>
                );
                })}
                </tbody>
            </table>
            <br/>
            <RateForm func={addRows} currentWatchlist={watchlist}/>
        </div>
        </>
    );
}

export default Table;