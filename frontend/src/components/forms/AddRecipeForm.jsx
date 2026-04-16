

import React, { useState, useEffect } from "react"; // useEffect add kiya hai images preview ke liye
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Image,
  Grid,
  Select,
  HStack,
  Tag,
  TagCloseButton,
  RadioGroup,
  Radio,
  useToast,
  Flex,
  Divider,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  Text,
} from "@chakra-ui/react";
import { addNewRecipe, updateRecipe } from "../../redux/recipeReducer/actions";

const cuisines = ["Mexican", "Italian", "Chinese", "Indian", "German", "Greek", "Filipino", "Japanese", "Other"];
const tagsList = ["Healthy", "Vegan", "Dessert", "Spicy", "Quick", "Pasta", "Sea food", "Chicken", "Main Dish", "Appetizer", "Curry", "Salad", "Soup"];

const steps = [
  { title: "First", description: "Add Basic Recipe Information" },
  { title: "Second", description: "Add Ingredients & Instructions" },
  { title: "Third", description: "Add Recipe Images" },
  { title: "Fourth", description: "Add Tags & Caption" },
];

// FIXED: editData ko props mein add kiya hai
export const AddRecipeForm = ({ closeModal, editData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const token = useSelector((store) => store.authReducer.token) || localStorage.getItem("token");

  const [step, setStep] = useState(1);
  const activeStepText = steps[step - 1]?.description || "";
  const [ingredient, setIngredient] = useState("");
  const [instruction, setInstruction] = useState("");

  // FIXED: editData se state initialize hogi taaki form bhara hua dikhe
  const [recipeData, setRecipeData] = useState(editData || {
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    images: [],
    cuisine: [],
    tags: [],
    veg: false,
    caption: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    const newArray = [...recipeData[arrayName]];
    newArray.splice(index, 1);
    setRecipeData((prevData) => ({ ...prevData, [arrayName]: newArray }));
  };

  const handleCuisineChange = (event) => {
    if (!recipeData.cuisine.includes(event.target.value)) {
      setRecipeData((prevData) => ({
        ...prevData,
        cuisine: [...prevData.cuisine, event.target.value],
      }));
    }
  };

  const handleCuisineRemove = (cuisine) => {
    setRecipeData((prevData) => ({
      ...prevData,
      cuisine: prevData.cuisine.filter((c) => c !== cuisine),
    }));
  };

  const handleTagsChange = (event) => {
    if (!recipeData.tags.includes(event.target.value)) {
      setRecipeData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, event.target.value],
      }));
    }
  };

  const handleTagRemove = (tag) => {
    setRecipeData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((t) => t !== tag),
    }));
  };

  const handleVegChange = (value) => {
    setRecipeData((prevData) => ({ ...prevData, veg: value === "true" }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setRecipeData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleAddIngredient = () => {
    if (ingredient.trim()) {
      setRecipeData((prevData) => ({
        ...prevData,
        ingredients: [...prevData.ingredients, ingredient],
      }));
      setIngredient("");
    }
  };

  const handleAddInstruction = () => {
    if (instruction.trim()) {
      setRecipeData((prevData) => ({
        ...prevData,
        instructions: [...prevData.instructions, instruction],
      }));
      setInstruction("");
    }
  };


const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  //Basic fields
  formData.append("title", recipeData.title || "");
  formData.append("description", recipeData.description || "");
  formData.append("veg", recipeData.veg ? "true" : "false");
  formData.append("caption", recipeData.caption || "");

  //Arrays (safe check)
  recipeData.cuisine?.forEach((c, i) => {
    formData.append(`cuisine[${i}]`, c);
  });

  recipeData.tags?.forEach((t, i) => {
    formData.append(`tags[${i}]`, t);
  });

  recipeData.ingredients?.forEach((ing, i) => {
    formData.append(`ingredients[${i}]`, ing);
  });

  recipeData.instructions?.forEach((ins, i) => {
    formData.append(`instructions[${i}]`, ins);
  });

  // IMAGE LOGIC (ONLY NEW FILES)
  if (recipeData.images && recipeData.images.length > 0) {
    recipeData.images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });
  }

 

  //API CALL
  if (editData?._id) {
    dispatch(updateRecipe(editData._id, formData, token, toast, closeModal));
  } else {
    dispatch(addNewRecipe(token, formData, toast, navigate, closeModal));
  }
};
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input name="title" value={recipeData.title} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={recipeData.description} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Cuisine</FormLabel>
              <Select placeholder="Select cuisines" onChange={handleCuisineChange}>
                {cuisines.map((c) => (<option key={c} value={c}>{c}</option>))}
              </Select>
              <HStack flexWrap="wrap" py="2" spacing="2">
                {recipeData.cuisine.map((c) => (
                  <Tag key={c} size="md">{c}<TagCloseButton onClick={() => handleCuisineRemove(c)} /></Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Veg/Non-Veg</FormLabel>
              <RadioGroup value={recipeData.veg.toString()} onChange={handleVegChange}>
                <HStack spacing="24px">
                  <Radio value="true">Veg</Radio>
                  <Radio value="false">Non-Veg</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <Divider />
            <Flex justifyContent="space-between" py="1rem">
              <Button variant="outline" onClick={closeModal}>Close</Button>
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            </Flex>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Ingredients</FormLabel>
              <Input mb="0.5rem" value={ingredient} onChange={(e) => setIngredient(e.target.value)} />
              <Button variant="outline" size="sm" onClick={handleAddIngredient}>Add Ingredient</Button>
              <HStack flexWrap="wrap" py="2" spacing="2">
                {recipeData.ingredients.map((ing, i) => (
                  <Tag key={i} size="md">{ing}<TagCloseButton onClick={() => handleRemoveArrayItem("ingredients", i)} /></Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Instructions</FormLabel>
              <Textarea mb="0.5rem" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
              <Button size="sm" variant="outline" onClick={handleAddInstruction}>Add Instruction</Button>
              <Stack py="2" spacing="2">
                {recipeData.instructions.map((ins, i) => (
                  <Tag key={i} size="md" width="100%" justifyContent="space-between" p={2}>
                    <Text>{`Step ${i + 1}: ${ins}`}</Text>
                    <TagCloseButton onClick={() => handleRemoveArrayItem("instructions", i)} />
                  </Tag>
                ))}
              </Stack>
            </FormControl>
            <Divider />
            <Flex justifyContent="space-between" py="1rem">
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            </Flex>
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={4}>
            <FormControl minH="20vh">
              <FormLabel>Upload Images {editData && "(Skip to keep existing)"}</FormLabel>
              <input type="file" multiple onChange={handleFileChange} />
              <Grid templateColumns="repeat(2, 1fr)" gap={2} mt={4}>
                {recipeData.images.map((img, i) => (
                  <Box key={i}>
                    <Image 
                       src={img instanceof File ? URL.createObjectURL(img) : (img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}/${img}`)} 
                       alt="preview" 
                       borderRadius="md"
                    />
                  </Box>
                ))}
              </Grid>
            </FormControl>
            <Divider />
            <Flex justifyContent="space-between" py="1rem">
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            </Flex>
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Select placeholder="Select tags" onChange={handleTagsChange}>
                {tagsList.map((t) => (<option key={t} value={t}>{t}</option>))}
              </Select>
              <HStack flexWrap="wrap" py="2" spacing="2">
                {recipeData.tags.map((t) => (
                  <Tag key={t} size="md">{t}<TagCloseButton onClick={() => handleTagRemove(t)} /></Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Caption</FormLabel>
              <Textarea name="caption" value={recipeData.caption} placeholder="Write a caption..." onChange={handleInputChange} />
            </FormControl>
            <Divider />
            <Flex justifyContent="space-between" py="1rem">
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              <Button colorScheme="orange" onClick={handleSubmit}>{editData ? "Update Recipe" : "Post Recipe"}</Button>
            </Flex>
          </Stack>
        );
      default: return null;
    }
  };

  return (
    <Box>
      <Stack mb={5}>
        <Stepper size="sm" index={step - 1}>
          {steps.map((s, i) => (
            <Step key={i}>
              <StepIndicator><StepStatus complete={<StepIcon />} /></StepIndicator>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Text fontSize="sm">Step {step}: <b>{activeStepText}</b></Text>
      </Stack>
      <form onSubmit={handleSubmit}>{renderStep()}</form>
    </Box>
  );
};