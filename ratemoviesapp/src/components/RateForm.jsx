import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
function RateForm({func,currentWatchlist}){

    // keeps track of the visibility of the elements
    const [visibility_search,setVisibility_search] = React.useState(true)
    const [visibility_details,setVisibility_details] = React.useState(true)
    const [visibility_dropdown,setVisibility_dropdown] = React.useState(true)

    // store the movie objects retrieved from the api
    const [data,setData] = React.useState({})

    // tracks the state of the details for the movie
    const [moviename,setMovieName] = React.useState("")
    const [overview,setOverview] = React.useState("")
    const [releasedDate,setReleasedDate] = React.useState("")
    const [remark,setRemark] = React.useState("")
    const [rate,setRate] = React.useState("0")

    // keeps track of the loading state
    const [loading,setLoading] = React.useState(true);

    // catch error in fetching data
    const [error,setError] = React.useState();

    // fetch data from moviedb api
    React.useEffect(()=>{
        fetch("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",{
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZGUzZjU4ZThmMDg0MGEzYjM3ZTI3MzZhYTMxMWRmMiIsInN1YiI6IjVkZmNlNTIxMjZkYWMxMDAxNDVlM2U4MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JULukLZIIt5tG_nPg7cwoxVFB66xHbJTGBSThayO4HM'
            }})
            .then(response => response.json())
            .then(response => {setData(response);
                            setLoading(false);
            }).catch(error => setError(error))
    },[])

    // handles the visibility of the search bar
    function handleVisibilitySearch() {
        setVisibility_search(!visibility_search)
        setVisibility_details(true)
        setMovieName("")
        setOverview("")
        setReleasedDate("")
        setRemark("")
    }

    // retrieve the details of the movie based on the movie name
    function retrieveDetails() {
        // fetch the details of the movie based on the movie name
        let selectedMovie = data.results.filter(function(movieObject) { return movieObject.original_title === moviename})

        // checks if the movie exists in the data that is fetched from the api
        if (selectedMovie.length == 0) {
            alert("Sorry, the details of the movie is not available");
            setOverview("")
            setReleasedDate("")

        } else {
            setOverview(selectedMovie[0].overview)
            setReleasedDate(selectedMovie[0].release_date)
            setVisibility_details(false)
            setVisibility_dropdown(false)
        }
    }

    // keeps track of the changes in the states
    function changeName(event) {
        setMovieName(event.target.value);
        setVisibility_dropdown(true)
    }
    const changeOverview = (event) => setOverview(event.target.value);
    const changeRemark = (event) => setRemark(event.target.value);
    const changeRate = (event) => setRate(event.target.value);
    const changeDate = (event) => setReleasedDate(event.target.value);

    // updates the state of moviename based on the onClick event for the options under the search bar
    const onSelect = (searchTerm) => {
        setMovieName(searchTerm);
    }

    // transfers the form details to the movie reviews table (add item to the table)
    const transferValue = (event) => {
        event.preventDefault();
        // checks if review for the movie already exists in the table
        // ensures that there are no duplicates found in the table
        let isExist = currentWatchlist.filter((item) => { return moviename === item.moviename})
        if (isExist.length != 0){
            alert("You have already added a review for this movie");
        } else if (moviename && rate){
            const val = {
                moviename,
                overview,
                releasedDate,
                remark,
                rate
            };
            func(val);
            // reset the values in the submit form
            clearState();
            setVisibility_search(true)
            alert("You have added the review successfully");
        } else {
            alert("Please fill in the details");
        }

    };
    // reset the values of the states
    const clearState = () => {
        setMovieName('');
        setOverview('');
        setReleasedDate('');
        setRemark('');
        setRate("0");
        setVisibility_details(true)
    };

    // handles the 'enter' key pressed by the user for search bar
    // fetch the movie object with the movie title closest to movie title given by the user
    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            let filteredMovies = data.results.filter((item) => {
                const searchTerm = moviename.toLowerCase()
                const regex = new RegExp(`.*${searchTerm}.*`);
                return searchTerm && item.original_title.toLowerCase() !== searchTerm && item.original_title.toLowerCase().match(regex)})
            if (filteredMovies.length !== 0) {
                console.log(filteredMovies)
                setMovieName(filteredMovies[0].original_title)
            }
            // in the event of no related movies are fetched, no action will be taken
        }

    }
    // Shows error message if the error state is true
    if(error)
        return (
            <div>
            Error
            <br/>
            <p>Please refresh the website</p>
            </div>
        );
    // Shows loading if the loading state is true
    if(loading)
        return (
            <div style={{"padding-left":"150px"}}>Loading..</div>
        );

    return (
        <>
        {/*show the search bar once the button is clicked*/}
        <button type="button" class={visibility_search ? "btn btn-primary" : "btn btn-danger"} onClick={handleVisibilitySearch}>{visibility_search ? "Add Item" : "Cancel"}</button>

        <div class="form">
            <div className="search-container" tabIndex={1} onKeyDown={handleKeyPress} hidden={visibility_search ? "hidden" : ""}>
                <div class="input-group mb-3">
                    {/*search bar to retrieve details for the desired movie*/}
                    <input type="text" value={moviename} onChange={changeName} aria-label="Recipient's username" placeholder="Search for current movie.." class="form-control"  aria-overviewribedby="basic-addon2" disabled={visibility_details ? "" : "disabled"}/>
                    <div className="input-group-append">
                        <button onClick={retrieveDetails} class="btn btn-outline-secondary">Retrieve Details</button>
                    </div>
                </div>

                {/*display all the movies with the titles similar to the movie title given by the user*/}
                <div className="dropdown" hidden={visibility_dropdown ? "" : "hidden"}>
                    {(data === null) ? "" : data.results.filter((item) => {
                        const searchTerm = moviename.toLowerCase()
                        const regex = new RegExp(`.*${searchTerm}.*`);
                        return searchTerm && item.original_title.toLowerCase() !== searchTerm && item.original_title.toLowerCase().match(regex)
                    }).map((item) => (
                        <div onClick={()=>onSelect(item.original_title)} className="cursor-pointer" key={item.original_title}>{item.original_title}</div>
                    ))}
                </div>
            </div>

            {/*display the details of the form only when the movie details are successfully fetched*/}
            <div hidden={visibility_details ? "hidden" : ""}>
                {/*overview of the movie is fetched from the stored data (retrieved from the api) */}
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Overview:</label><br/>
                    <div class="col-sm-10">
                        <textarea type="text" value={overview === "" ? "" : overview} class="form-control" onChange={changeOverview} disabled/>
                    </div>
                </div>
                <br></br>

                {/*release date of the movie is fetched from the stored data (retrieved from the api)*/}
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label" >Release Date:</label>
                    <div class="col-sm-10">
                        <input type="text" value={releasedDate === "" ? "" : releasedDate} class="form-control" onChange={changeDate} disabled/>
                    </div>
                </div>
                <br></br>

                {/*remarks of the movie given by the user*/}
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Remark:</label>
                    <div class="col-sm-10">
                        <textarea type="text" class="form-control" value={remark} onChange={changeRemark}/>
                    </div>
                </div>
                <br></br>

                {/*rating given by the user (ranging from 0 to 5)*/}
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Rate:</label><br/>
                    <div class="col-sm-10">
                        <select class="form-control" value={rate} onChange={changeRate}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                 </div>
                    <br></br>


                <div class="form-group row">
                    <div class="col-sm-2 col-form-label">
                        {/*reset the values of the input elements*/}
                        <button onClick={clearState}  class="btn btn-primary">Reset</button>
                    </div>
                    <div className="col-sm-2 col-form-label">
                        {/*add the details of the movie to the table*/}
                        <button onClick={transferValue} class="btn btn-success">Submit</button>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}

export default RateForm;
