
import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // GET: Fetch all toys
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((data) => setToys(data))
      .catch((error) => console.error(error));
  }, []);

  // POST: Add a new toy
  function handleAddToy(newToy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newToy,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((createdToy) => {
        setToys((currentToys) => [...currentToys, createdToy]);
        setShowForm(false);
      })
      .catch((error) => console.error(error));
  }

  // PATCH: Increase likes
  function handleLike(toy) {
    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: toy.likes + 1,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys((currentToys) =>
          currentToys.map((item) =>
            item.id === updatedToy.id ? updatedToy : item
          )
        );
      })
      .catch((error) => console.error(error));
  }

  // DELETE: Remove a toy
  function handleDonate(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete toy");
        }

        setToys((currentToys) =>
          currentToys.filter((toy) => toy.id !== id)
        );
      })
      .catch((error) => console.error(error));
  }

  function handleClick() {
    setShowForm((currentValue) => !currentValue);
  }

  return (
    <>
      <Header />

      {showForm && <ToyForm onAddToy={handleAddToy} />}

      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>

      <ToyContainer
        toys={toys}
        onLike={handleLike}
        onDonate={handleDonate}
      />
    </>
  );
}

export default App;
