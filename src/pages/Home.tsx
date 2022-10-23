import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonToast, IonCheckbox, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline as checkIcon, trashBin } from 'ionicons/icons'
import { useEffect, useState } from 'react';
import './Home.css';


const Home: React.FC = () => {
  const [task, setTask]: any = useState('')
  const [taskList, setTaskList]: any[] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastmessage, setToastMessage] = useState('')

  useEffect(() => {
    if (localStorage.getItem('dataKey') !== null) {
      const saveData: string | null = localStorage.getItem('dataKey')

      if (typeof saveData === 'string' && saveData.trim() !== "") {
        const updateList = JSON.parse(saveData);

        setTaskList(updateList)
      }
    }
  }, [])

  useEffect(() => {
    (taskList.length > 0) ? localStorage.setItem('dataKey', JSON.stringify(taskList)) : localStorage.removeItem('dataKey')
  }, [taskList])

  return (
    <IonPage>
      <IonHeader collapse="fade">
        <IonToolbar>
          <IonTitle>Kevin Todo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' fullscreen >

        <IonItem>
          <IonLabel position="floating">Task</IonLabel>
          <IonInput placeholder='Write a task...'
            value={task}
            clearInput={true}
            onIonChange={(e) =>
              setTask(e.detail.value)
            }
          />
        </IonItem>
        <IonButton
          expand="full"
          disabled={task.trim().length === 0}
          onClick={(e) => {
            e.preventDefault()
            setTaskList((prev: []) => [{ name: task, done: false }, ...prev])
            setShowToast(true)
            setToastMessage(`Added - ${task}`)

            setTask('')
          }
          }>
          Enter
        </IonButton>
        {taskList.length > 0 &&
          <IonButton
            expand="full"
            color={'danger'}
            onClick={(e) => {
              e.preventDefault()
              setTaskList([])
              setShowToast(true)
              setToastMessage(`Cleared tasks`)
              setTask('')
            }
            }>
            Reset
          </IonButton>}
        <IonToast
          color={'dark'}
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastmessage}
          duration={200}
          icon={checkIcon}
        />
        {taskList.length > 0 &&
          <IonList inset={true} >
            {taskList.sort((a: any, b: any) => Number(a.done) - Number(b.done)).map((task?: any, index?: number) => {
              return <IonItem key={index}>
                <IonCheckbox
                  checked={task.done}
                  onIonChange={(e) => {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                    setTaskList((prev: any) => {
                      const newArr = prev.map((task: object, taskIndex: number) => {
                        if (index === taskIndex) {
                          return { ...task, done: e.detail.checked }
                        }
                        return task
                      })
                      return newArr
                    })

                  }}
                  slot='start'></IonCheckbox>
                <IonLabel color={task.done ? "danger" : "dark"} >
                  {task.name}
                </IonLabel>
                <IonButton
                  onClick={(e) => {
                    e.preventDefault()
                    setTaskList((prev: any) => {
                      return prev.filter((task: object, taskIndex: number) => index !== taskIndex
                      )
                    })
                  }}
                  color={'danger'} size={'small'}>
                  <IonIcon slot="icon-only" size={'small'} icon={trashBin}></IonIcon>
                </IonButton>
              </IonItem>
            })}

          </IonList>
        }
      </IonContent>
    </IonPage >
  );
};


export default Home;
