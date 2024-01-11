import React from "react";
import data from './data/movies.json'
import RateForm from "./RateForm";
import 'bootstrap/dist/css/bootstrap.min.css';

function Table(){
    // retrieve the hardcoded data from the movies.json
    const [watchlist,setWatchlist] = React.useState(data)

    // keeps track of the theme of the table
    const [theme, setTheme] = React.useState(() => {
        const initialTheme = localStorage.getItem("theme");
        return initialTheme ? initialTheme : "";
    });

    // retrieve the theme stored in the cache
    function getThemeFromLocalStorage() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }

    // toggles between light theme and dark theme
    function toggleTheme() {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "" ? "dark" : "";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    }

    // when theme variable changes, run the getThemeFromLocalStorage() function
    React.useEffect(() => {
        getThemeFromLocalStorage();
    }, [theme]);

    // add rows to the table
    const addRows = (data) => {
        const updatedWatchlist = [...watchlist];
        updatedWatchlist.push(data);
        setWatchlist(updatedWatchlist);
    };

    return (
        <>
        {/*toggle button to toggle between light theme and dark theme*/}
        <button onClick={toggleTheme} class={theme=="" ? "btn btn-dark" : "btn btn-light"}>{theme == "" ? "Switch to Dark mode" : "Switch to Light mode"}</button>
        {/*movie review table    */}
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
                        <td><div class="scrollbar">{item.overview}</div></td>
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