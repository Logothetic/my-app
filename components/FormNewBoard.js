"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const FormNewBoard = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await axios.post("/api/board", { name });
      setName("");
      toast.success("Board created successfully!");
      router.refresh();
    } catch (e) {
      const errorMessage =
        e.response?.data?.error || e.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Create a new Feedback board</p>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Board Name</span>
        </div>
        <input
          required
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full "
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <button className="btn btn-primary btn-block" type="submit">
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        Create board
      </button>
    </form>
  );
};

export default FormNewBoard;
