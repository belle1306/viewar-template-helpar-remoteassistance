import {Observable, Subject} from 'rxjs'
import {generateId} from '../utils/index'

const getFakedClientList = (amount) => {
  const list = []
  for (let i = 0; i < amount; i++) {
    list.push({
      name: `User ${i}`
    })
  }

  return list
}

const createSession = (sessionId) => {
  return {
    id: sessionId
  }
}

export const createCallClient = async() => {
  const incomingCall = new Subject()

  return {
    join: async({sessionId}) => {
      const client = {
        id: sessionId
      }

      setTimeout(() => incomingCall.next(client), 2000)
      return createSession(sessionId)
    },
    answerCall: async() => {
      console.log('call answered')
    },
    sendData: async(data) => {
      console.log('send data', data)
    },
    incomingCall,
    clients: Object.assign(
      Observable.create(observer => {
        observer.next({
          id: generateId()
        })
      }),
      {
        list: () => getFakedClientList(10)
      }
    ),
    call: async({id}) => {
    }
  }
}
