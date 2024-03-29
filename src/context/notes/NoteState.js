import React from "react";
import { useState } from "react";
import noteContext from "./NoteContext";

const NoteState=(props)=>{
    const host= "http://localhost:5000"

    const notesInitial = []

      const [notes, setNotes] = useState(notesInitial)

      // Get all Notes
      const getNotes = async ()=>{
        // API call
        const response = await fetch(`${host}/api/Notes/fetchallnotes`, {
          method: 'GET', 
         
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          },
        
          
        });

        const json= await response.json();
        console.log(json)
        setNotes(json)

      }
      // Add a Note
      const addNote=async (title, description, tag)=>{
        // API call
        const response = await fetch(`${host}/api/Notes/addnote`, {
          method: 'POST', 
         
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          },
      
          body: JSON.stringify({title, description, tag})
        });

        const note=await response.json()
        console.log("Adding a note");
        setNotes(notes.concat(note));

      }


      // Delete a Note
      const deleteNote = async(id)=>{
        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',  
         
          headers: {
            "Content-Type": "application/json",
           // 'Accept': 'application/json',
             "auth-token": localStorage.getItem('token')
          }
        });
        const json= response.json();
        console.log(json);

        // console.log("Deleting the note with id" + id);
        const newNotes = notes.filter((note)=>{ return note._id!==id}) 
        setNotes(newNotes);
      }



      // Edit a Note
      const editNote= async (id, title, description, tag)=>{
        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT', 
         
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          },
      
          body: JSON.stringify({id,title, description, tag})
        });
        const json= await response.json();
        console.log(json)
        let newNotes=JSON.parse(JSON.stringify(notes))

        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id){
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tag=tag;
             break;
          }
         
        }
        console.log(id,newNotes);
        setNotes(newNotes);

      }

    return (
        <noteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </noteContext.Provider>
    )

    }

export default NoteState;