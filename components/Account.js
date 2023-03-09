import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import PageTitle from './PageTitle'
import Link from 'next/link'
import WatchlistCard from './WatchlistCard'

export default function Account({ session }) {
    // account info
    const supabase = useSupabaseClient()
    const user = useUser()
    const userId = user.id

    // watchlist
    const [fetchError, setFetchError] = useState(null)
    const [shows, setShows] = useState(null)
    const [watchlist, setWatchlist] = useState(null)

    const [addashow, setAddashow] = useState(null)


    // const [loading, setLoading] = useState(true)
    // const [username, setUsername] = useState(null)
    // const [avatar_url, setAvatarUrl] = useState(null)

    // useEffect(() => {
    //     getProfile()
    // }, [session])

    // async function getProfile() {
    //     try {
    //         setLoading(true)

    //         let { data, error, status } = await supabase
    //             .from('profiles')
    //             .select(`username, avatar_url`)
    //             .eq('id', user.id)
    //             .single()

    //         if (error && status !== 406) {
    //             throw error
    //         }

    //         if (data) {
    //             setUsername(data.username)
    //             setAvatarUrl(data.avatar_url)
    //         }
    //     } catch (error) {
    //         alert('Error loading user data!')
    //         console.log(error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // async function updateProfile({ username, avatar_url }) {
    //     try {
    //         setLoading(true)

    //         const updates = {
    //             id: user.id,
    //             username,
    //             avatar_url,
    //             updated_at: new Date().toISOString(),
    //         }

    //         let { error } = await supabase.from('profiles').upsert(updates)
    //         if (error) throw error
    //             alert('Profile updated!')
    //     } catch (error) {
    //         alert('Error updating the data!')
    //         console.log(error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    useEffect(() => {
        getWatchlist()
        getShows()
    }, [watchlist])

    async function getWatchlist() {
        const {data, error} = await supabase
                .from("towatch")
                .select()
                .eq("user_id", userId)

        if(error) {
            setFetchError("Could not fetch data")
            setWatchlist(null)
            console.log(error)
        }
        if(data) {
            setWatchlist(data)
            setFetchError(null)
        }
    }

    async function getShows() {
        const {data, error} = await supabase
                .from("shows")
                .select()

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

    async function deleteShow(showId) {
        const {data, error} = await supabase
                .from("watchlist")
                .delete()
                .eq("id", showId)
                .select()
        if(error) {
            console.log(error)
        }
        if(data) {
            // setWatchlist(watchlist.filter(show => show.id !== showId))
            console.log("Deleted")
        }
    }

    async function addShow(event) {
        event.preventDefault()
        console.log("add", addashow)
        const {data, error} = await supabase
                .from("watchlist")
                .insert({show_id: addashow, user_id: userId})
        if(error) {
            console.log(error)
        }
        if(data) {
            console.log("added", data)
        }
    }
    
    function handleChange(event) {
        setAddashow(event)
    }

    return (
        // <div className="form-widget">
        //     <div>
        //         <label htmlFor="email">Email</label>
        //         <input id="email" type="text" value={session.user.email} disabled />
        //     </div>
        //     <div>
        //         <label htmlFor="username">Username</label>
        //         <input id="username" type="text" value={username || ''} onChange={(e) => setUsername(e.target.value)}
        //         />
        //     </div>

        //     <div>
        //         <button className="button primary block" onClick={() => updateProfile({ username, avatar_url })} disabled={loading}>{loading ? 'Loading ...' : 'Update'}</button>
        //     </div>

        //     <div>
        //         <button className="button block" onClick={() => supabase.auth.signOut()}>Sign Out</button>
        //     </div>
        // </div>
        <div className="mt-12 lg:mt-8"> {/* wrapper */}
            <PageTitle title={"Watchlist"}>Keep track of shows you want to see</PageTitle>

            {/* user */}
            <section className="mt-8 mb-8 items-center flex gap-2 text-sm">
                <p>{session.user.email}</p>
                (<button className="text-bbblue hover:text-bblightblue" onClick={() => supabase.auth.signOut()}>Sign out</button>)
            </section>

            {/* add show */}
            <section className="mb-4">
            <div className="items-center bg-gray-800 border-gray-700 rounded-md p-4 text-sm">
                <h2 className="text-lg font-bold text-white">Add a show</h2>
                <form onSubmit={addShow}>
                <select onChange={(e) => handleChange(e.target.value)}>
                    {shows && shows.map(show => show.name && (<option key={show.id} value={show.id}>{show.name}</option>))}
                </select>
                <input type="submit" className="text-xs font-bold px-3 py-2 text-center text-white bg-bbblue rounded-lg hover:bg-bblightblue ring-1 ring-bblightblue hover:ring-bblightblue" value="Add" />
                </form>
            </div>
            </section>

            {/* watchlist */}
            <section className="grid gap-8 mb-4 md:grid-cols-2">
                {watchlist && watchlist.map(show => (
                        <WatchlistCard key={show.id} show={show} buttonAction={() => {deleteShow(show.id)}} />
                ))}
            </section>
        </div>
    )
}