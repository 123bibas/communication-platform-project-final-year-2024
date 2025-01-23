import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TitleCard from "../../../components/Cards/TitleCard"
function UserChannels({ data, handleSubmit, title }) {
    return (
        <TitleCard title={`${title}`}>
            {/** Table Data */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="normal-case">Project</th>
                            <th className="normal-case">Manager</th>
                            <th className="normal-case">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((val, i) => {
                                return (
                                    <tr key={i}>
                                        <th>{i + 1}</th>
                                        <td>{val.name}</td>
                                        <td>{val.manager.name}</td>
                                        <td><button className="btn btn-ghost text-success" onClick={() => handleSubmit(val)}><PencilIcon className='h-4 w-4' /></button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </TitleCard>
    )
}
export default UserChannels