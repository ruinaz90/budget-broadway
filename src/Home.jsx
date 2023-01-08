import { useEffect, useState } from "react"
import supabase from "./config/supabaseClient"
import ShowCard from "./components/ShowCard"

function Home() {
    const [fetchError, setFetchError] = useState(null)
    const [shows, setShows] = useState(null)
    const [orderBy, setOrderBy] = useState("name")
    const [ascending, setAscending] = useState(true)

    useEffect(() => {
        const fetchShows = async() => {
            const {data, error} = await supabase
                .from("shows")
                .select()
                .order(orderBy, {ascending})

            if(error) {
                setFetchError("Could not fetch data")
                setShows(null)
                console.log(error)
            }
            if(data) {
                setShows(data)
                setFetchError(null)
            }
        }
        fetchShows()
    }, [orderBy, ascending])

    return (
        <>
            {fetchError && (<p>{fetchError}</p>)}

            {shows && (
                <div>
                    <div className="mb-8 items-center flex gap-2 text-sm">
                        <span>Sort by: </span>
                        <button className="border border-gray-500 rounded-md px-3 py-1 hover:border-gray-400" onClick={() => {
                            setOrderBy("name")
                            setAscending(true)
                        }}>Show (ascending)</button>
                        
                        <button className="border border-gray-500 rounded-md px-3 py-1 hover:border-gray-400" onClick={() => {
                            setOrderBy("name")
                            setAscending(false)
                        }}>Show (descending)</button>
                        
                        <button className="border border-gray-500 rounded-md px-3 py-1 hover:border-gray-400" onClick={() => {
                            setOrderBy("location")
                            setAscending(true)
                        }}>Location</button>
                    </div>

                    <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                        {shows.map(show => show.name && (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
export default Home