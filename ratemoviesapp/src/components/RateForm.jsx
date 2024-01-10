import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
function RateForm({func,currentWatchlist}){

    const [visibility_search,setVisibility_search] = React.useState(true)
    const [visibility_details,setVisibility_details] = React.useState(true)
    const [visibility_dropdown,setVisibility_dropdown] = React.useState(true)
    const [data,setData] = React.useState({})
    const [moviename,setMovieName] = React.useState("")
    const [desc,setDesc] = React.useState("")
    const [releasedDate,setReleasedDate] = React.useState("")
    const [remark,setRemark] = React.useState("")
    const [rate,setRate] = React.useState("0")
    const [loading,setLoading] = React.useState(true);


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
            })},[])

    function handleVisibilitySearch() {
        setVisibility_search(!visibility_search)
        setVisibility_details(true)
        setMovieName("")
        setDesc("")
        setReleasedDate("")
        setRemark("")
    }


    function retrieveDetails() {
        let selectedMovie = data.results.filter(function(movieObject) { return movieObject.original_title === moviename})
        // console.log(filteredMovies);
        if (selectedMovie.length == 0) {
            // setMovieName(event.target.value)
            alert("Sorry, the movie does not exist");
            setDesc("")
            setReleasedDate("")

        } else {
            // setMovieName(event.target.value)
            console.log(selectedMovie)
            setDesc(selectedMovie[0].overview)
            setReleasedDate(selectedMovie[0].release_date)
            setVisibility_details(false)
            setVisibility_dropdown(false)
        }


    }
    function handleChange(event) {
        setMovieName(event.target.value);
        setVisibility_dropdown(true)
        console.log(currentWatchlist)
    }
    const changeName = (event) => setMovieName(event.target.value);
    const changeDesc = (event) => setDesc(event.target.value);
    const changeRemark = (event) => setRemark(event.target.value);
    const changeRate = (event) => setRate(event.target.value);
    const changeDate = (event) => setReleasedDate(event.target.value);

    const onSearch = (searchTerm) => {
        setMovieName(searchTerm);
    }
    const transferValue = (event) => {
        event.preventDefault();
        let isExist = currentWatchlist.filter((item) => { return moviename === item.moviename})
        if (isExist.length != 0){
            alert("You have already added a review for this movie");

        } else if (moviename && desc && releasedDate && remark && rate){
            const val = {
                moviename,
                desc,
                releasedDate,
                remark,
                rate
            };
            func(val);
            clearState();
            setVisibility_search(true)
            alert("You have added the review successfully");
        } else {
            alert("Please fill in the details");
        }

    };

    const clearState = () => {
        setMovieName('');
        setDesc('');
        setReleasedDate('');
        setRemark('');
        setRate("0");
        setVisibility_details(true)
    };
    // function handleSubmit(e) {
    //     e.preventDefault()
    //     fetch("https://httpbin.org/post",{
    //         method: 'POST',
    //         body: JSON.stringify({
    //             name: value,
    //             email: check,
    //             mobileNumber: 3123133223,
    //         })
    //     }).then((res)=>res.json())
    //         .then((result)=>console.log(result.json))
    // }

    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const resultContainer = React.useRef<HTMLDivElement>(null);
    const [showResults, setShowResults] = React.useState(false);
    const [defaultValue, setDefaultValue] = React.useState("");

    // const handleSelection = (selectedIndex: number) => {
    //     const selectedItem = results[selectedIndex];
    //     if (!selectedItem) return resetSearchComplete();
    //     onSelect && onSelect(selectedItem);
    //     resetSearchComplete();
    // };

    const resetSearchComplete = React.useCallback(() => {
        setFocusedIndex(-1);
        setShowResults(false);
    }, []);

    // const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    //     const { key } = e;
    //     let nextIndexCount = 0;
    //
    //     // move down
    //     if (key === "ArrowDown")
    //         nextIndexCount = (focusedIndex + 1) % results.length;
    //
    //     // move up
    //     if (key === "ArrowUp")
    //         nextIndexCount = (focusedIndex + results.length - 1) % results.length;
    //
    //     // hide search results
    //     if (key === "Escape") {
    //         resetSearchComplete();
    //     }
    //
    //     // select the current item
    //     if (key === "Enter") {
    //         e.preventDefault();
    //         handleSelection(focusedIndex);
    //     }
    //
    //     setFocusedIndex(nextIndexCount);
    // };

    // type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
    // const handleChange: changeHandler = (e) => {
    //     setDefaultValue(e.target.value);
    //     onChange && onChange(e);
    // };


    if(loading)
        return (
            <div style={{"padding-left":"150px"}}>Loading</div>
        );

    return (
        <>
        <button type="button" class={visibility_search ? "btn btn-primary" : "btn btn-danger"} onClick={handleVisibilitySearch}>{visibility_search ? "Add Item" : "Cancel"}</button>
        <div class="form">
            <div className="search-container" hidden={visibility_search ? "hidden" : ""}>
                <div class="input-group mb-3">
                    <input type="text" value={moviename} onChange={handleChange} aria-label="Recipient's username" placeholder="Search for movie.." class="form-control"  aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <button onClick={retrieveDetails} class="btn btn-outline-secondary">Retrieve Details</button>
                    </div>
                </div>
                <div className="dropdown" hidden={visibility_dropdown ? "" : "hidden"}>
                    {(data === null) ? "" : data.results.filter((item) => {
                        const searchTerm = moviename.toLowerCase()
                        const regex = new RegExp(`.*${searchTerm}.*`);
                        return searchTerm && item.original_title.toLowerCase() !== searchTerm && item.original_title.toLowerCase().match(regex)
                    }).map((item) => (
                        <div onClick={()=>onSearch(item.original_title)} className="cursor-pointer" key={item.original_title}>{item.original_title}</div>
                    ))}

                </div>
            </div>
            <div hidden={visibility_details ? "hidden" : ""}>

            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Description:</label><br/>
                <div class="col-sm-10">
                    <textarea type="text" value={desc === "" ? "" : desc} class="form-control" onChange={changeDesc} disabled/>
                </div>
            </div>
            <br></br>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" >Release Date:</label>
                <div class="col-sm-10">
                    <input type="text" value={releasedDate === "" ? "" : releasedDate} class="form-control" onChange={changeDate} disabled/>
                </div>
            </div>
            <br></br>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Remark:</label>
                <div class="col-sm-10">
                    <textarea type="text" class="form-control" value={remark} onChange={changeRemark}/>
                </div>
            </div>
            <br></br>
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
                    <button onClick={clearState}  class="btn btn-primary">Reset</button>
                </div>
                <div className="col-sm-2 col-form-label">
                    <button onClick={transferValue} class="btn btn-success">Submit</button>
                </div>
            </div>

            </div>
        </div>
        </>
    );
}

export default RateForm;
