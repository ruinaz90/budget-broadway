function TicketInfoCard({ticketType, children}) {
    return (
        <>
            <div className="items-center bg-gray-800 border-gray-700 rounded-md p-4">
                <h2 className="text-xl font-bold text-white">{ticketType}</h2>
                <p>{children}</p>
            </div>
        </>
    )
}

export default TicketInfoCard