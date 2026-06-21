"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";
import Image from "next/image";
import { updateMe } from "@/lib/api/clientApi";

const ProfileEdit = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      const formValues = Object.fromEntries(formData);
      const newUsername = (formValues.username as string)?.trim();

      if (!user || !newUsername) {
        setError("Username is required");
        return;
      }

      if (newUsername === user.username) {
        router.push("/profile");
        return;
      }

      const updatedUser = await updateMe({ username: newUsername });

      setUser(updatedUser);
      router.push("/profile");
      router.refresh();
    } catch {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={user.username}
              className={css.input}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileEdit;
