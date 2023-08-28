import React, {useState} from 'react';

function Home() {

    const [name, setName] = useState("");
    const [vote, setVote] = useState(false);

    const handleNameDetailsChange = (event) => {
        let newValue = event.target.value;
        setName(newValue);
    }
    const handleVoteDetailsChange = (event) => {
        event.stopPropagation();
        let newValue = event.target.checked;
        setVote(newValue);
    }
    const handleSubmit= async (e)=>{
        e.preventDefault();
        // POST request using fetch()
        const response = await fetch('http://localhost:4000/vote', {
        method: 'POST',
        body: JSON.stringify({
            inputName: name,
            inputVote: vote
        }),
        headers: {
            'Content-Type': 'application/json'
        }
        });
        const result = await response.json();
        console.log(result);
    }

    return(
        <section>
            <div class="container-fluid">
                <h1 class="mt-5">Votes</h1>
                <form onSubmit={handleSubmit}>
                    <div class="input-group justify-content-center">
                        <div class="input-group-prepend">
                            <input type="text" name="inputName" class="form-control" value={name} onChange={(event) => handleNameDetailsChange(event)}/>
                            <input type="checkbox" name="inputVote" class="form-control" value={vote} onChange={(event) => handleVoteDetailsChange(event)}/>
                            <button type="submit" class="btn btn-primary mb-2">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Home;