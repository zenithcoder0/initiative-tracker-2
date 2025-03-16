import { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import HealthAvatar from "./HealthAvatar"; // Adjust path if needed

const App = () => {
  const [initiativeArray, setInitiativeArray] = useState(() => {
    const savedData = localStorage.getItem("initiativeData");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [deadCharacters, setDeadCharacters] = useState([]);
  const [multiName, setMultiName] = useState("");
  const [multiManualInitiative, setMultiManualInitiative] = useState("");
  const [multiModifier, setMultiModifier] = useState("");
  const [multiCount, setMultiCount] = useState("");
  const [multiHealth, setMultiHealth] = useState("");

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [healthChange, setHealthChange] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [roundCount, setRoundCount] = useState(1);

  useEffect(() => {
    localStorage.setItem("initiativeData", JSON.stringify(initiativeArray));
  }, [initiativeArray]);

  const nextRound = () => setRoundCount((prev) => prev + 1);
  const previousRound = () => setRoundCount((prev) => (prev > 1 ? prev - 1 : 1));

  const rollInitiative = () => Math.floor(Math.random() * 20) + 1;

  const removeCharacter = (index) => {
    const character = initiativeArray[index];
    setInitiativeArray(initiativeArray.filter((_, i) => i !== index));
    setDeadCharacters([...deadCharacters, character]); // Move to dead list
  };

  const addMultiInitiative = () => {
    if (!multiName.trim()) return alert("Please enter a name.");
    if (!multiModifier && !multiManualInitiative)
      return alert("Enter an initiative or a modifier.");
    if (multiModifier && multiManualInitiative)
      return alert("You cannot have both a modifier and a manual initiative.");
    if (!multiCount || parseInt(multiCount) < 1)
      return alert("Enter a valid count number (1 or more).");

    const count = parseInt(multiCount);
    const health = parseInt(multiHealth) || 10;
    const modifier = parseInt(multiModifier);
    const manualInitiative = parseInt(multiManualInitiative);

    const newEntries = [];
    for (let i = 0; i < count; i++) {
      const initiative = modifier ? rollInitiative() + modifier : manualInitiative;
      newEntries.push({ name: `${multiName} ${i + 1}`, initiative, health, maxHealth: health });
    }

    setInitiativeArray([...initiativeArray, ...newEntries].sort((a, b) => b.initiative - a.initiative));
    setMultiName("");
    setMultiManualInitiative("");
    setMultiModifier("");
    setMultiCount("");
    setMultiHealth("");
  };

  const handleAvatarClick = (index) => {
    setSelectedCharacter((prev) => (prev === index ? null : index));
  };

  const applyHealthChange = () => {
    if (selectedCharacter === null) return;
    const updatedArray = [...initiativeArray];

    updatedArray[selectedCharacter].health += parseInt(healthChange) || 0;
    setInitiativeArray(updatedArray);
    setSelectedCharacter(null);
    setHealthChange("");
  };

  const applyMaxDamage = () => {
    if (selectedCharacter === null) return;
    const updatedArray = [...initiativeArray];

    updatedArray[selectedCharacter].health = 0;
    setInitiativeArray(updatedArray);
    setSelectedCharacter(null);
    setHealthChange("");
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >

      <Typography variant="h4" gutterBottom>
        Initiative Tracker
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
        <Button variant="contained" color="error" onClick={previousRound}>
          -
        </Button>
        <Typography variant="h6">Round: {roundCount}</Typography>
        <Button variant="contained" color="primary" onClick={nextRound}>
          +
        </Button>
      </Box>

      {initiativeArray.length > 0 && (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setInitiativeArray([]);
              setSelectedCharacter(null);
              setShowForm(true);
            }}
          >
            Clear Initiative
          </Button>
          {!showForm && (
            <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
              Add Additional Characters
            </Button>
          )}
        </Box>
      )}

      {/* Initiative Display */}
      <Box 
  sx={{ 
    display: "flex", 
    gap: 2, 
    overflowX: "auto", 
    p: 2, 
    whiteSpace: "nowrap", 
    maxWidth: "100%",
  }}
>
  {initiativeArray.map((char, idx) => ( // ✅ Rename `index` to `idx`
    <Box 
      key={idx} 
      sx={{ 
        textAlign: "center", 
        flexShrink: 0, 
        cursor: "pointer", 
        border: selectedCharacter === idx ? "2px solid blue" : "none", 
        borderRadius: "8px",
        padding: "5px",
      }}
      onClick={() => handleAvatarClick(idx)} // ✅ Now correctly uses `idx`
    >
      {/* Initiative Number (Now Clickable) */}
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {char.initiative}
      </Typography>
      
      {/* Character Avatar */}
      <HealthAvatar name={char.name} health={char.health} maxHealth={char.maxHealth} />
      
      {/* Remove Button for Dead Characters */}
      {char.health <= 0 && (
        <Button 
          variant="contained" 
          color="error" 
          size="small" 
          sx={{ mt: 1 }} 
          onClick={() => removeCharacter(idx)} // ✅ Fix: Pass `idx`
        >
          Remove
        </Button>
      )}
    </Box>
  ))}
</Box>


      {/* Health Adjustment */}
      {selectedCharacter !== null && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="h6">
            Adjust Health for {initiativeArray[selectedCharacter]?.name}
          </Typography>
          <TextField
            label="Health Change (+/-)"
            type="number"
            variant="outlined"
            value={healthChange}
            onChange={(e) => setHealthChange(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={applyHealthChange} sx={{ ml: 2 }}>
            Apply
          </Button>
          <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={applyMaxDamage}>
            Max Damage
          </Button>
        </Box>
      )}

      {deadCharacters.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Fallen Characters</Typography>
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", p: 2 }}>
            {deadCharacters.map((char, index) => (
              <HealthAvatar key={index} name={char.name} health={0} maxHealth={char.maxHealth} />
            ))}
          </Box>
        </Box>
      )}

      {/* Initiative Entry Form */}
      {showForm && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3, alignItems: "center", width: "100%" }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={multiName}
            onChange={(e) => setMultiName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Manual Initiative"
            type="number"
            variant="outlined"
            value={multiManualInitiative}
            onChange={(e) => setMultiManualInitiative(e.target.value)}
          />
          <TextField
            fullWidth
            label="Initiative Modifier"
            type="number"
            variant="outlined"
            value={multiModifier}
            onChange={(e) => setMultiModifier(e.target.value)}
          />
          <TextField
            fullWidth
            label="Count"
            type="number"
            variant="outlined"
            value={multiCount}
            onChange={(e) => setMultiCount(e.target.value)}
          />
          <TextField
            fullWidth
            label="Health"
            type="number"
            variant="outlined"
            value={multiHealth}
            onChange={(e) => setMultiHealth(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={addMultiInitiative}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Add Character
          </Button>

          <Button variant="contained" color="secondary" onClick={() => setShowForm(false)} disabled={initiativeArray.length === 0}>
            Start Combat
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default App;
