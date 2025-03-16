import React from "react";
import { Avatar, LinearProgress, Typography, Box } from "@mui/material";

interface HealthAvatarProps {
  name: string;
  imageUrl?: string;
  health: number;
  maxHealth: number;
}

const HealthAvatar: React.FC<HealthAvatarProps> = ({ name, imageUrl, health, maxHealth }) => {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 100 }}>
      {/* Avatar */}
      <Avatar
        alt={name}
        src={imageUrl}
        sx={{
          width: { xs: 56, sm: 64 }, // Slightly smaller on mobile
          height: { xs: 56, sm: 64 },
          minWidth: 56, // ✅ Ensures consistent spacing when scrolling
          mb: 1,
          border: "2px solid #fff",
          boxShadow: 2
        }}
      />


      {/* Health Bar */}
      <LinearProgress
        variant="determinate"
        value={healthPercentage}
        sx={{
          width: "100%",
          height: 8,
          borderRadius: 5,
          backgroundColor: "#ddd",
          "& .MuiLinearProgress-bar": {
            backgroundColor:
              healthPercentage > 66 ? "green" :
                healthPercentage > 33 ? "yellow" :
                  "red"
          }
        }}
      />
      {/* Name & Health Text */}
      <Typography variant="caption" sx={{ mt: 1 }}>
        {name} - {health}/{maxHealth} HP
      </Typography>
    </Box>
  );
};

export default HealthAvatar;
