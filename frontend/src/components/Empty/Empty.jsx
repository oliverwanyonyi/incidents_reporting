import React from 'react'
import empty from '../../assets/empty.png'

const Empty = ({span,msg}) => {
  return (
    <div className='bg-white w-full text-center  pl-9'>

      
    <tr className='w-full'>
    <td colSpan={span} className='flex items-center justify-center w-full align-middle text-center'>
                    <div className="flex items-center flex-col text-lg font-medium text-neutral-700 py-2 text-center">
                      <img src={empty} width={30} alt="empty" />
                      <div className="text-[14px] font-normal">{msg}</div>
                    </div>
                  </td>
                </tr>

                </div>

  )
}

export default Empty