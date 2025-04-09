import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// import { useWatch } from "react-hook-form/dist";

const ZOHO = window.ZOHO;

function App() {
  const [initialized, setInitialized] = useState(false); // initialize the widget
  const [entity, setEntity] = useState(null); // keeps the module
  const [entityId, setEntityId] = useState(null); // keeps the module id
  const [recordData, setRecordData] = useState(null); // holds record response
  const [isOtherSelected, setIsOtherSelected] = useState(false); // is the other option selected

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // initialize the app
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      ZOHO.CRM.UI.Resize({ height: "800", width: "900" }); // resize the widget window
      setEntity(data?.Entity);
      setEntityId(data?.EntityId?.[0]);

      setInitialized(true);
    });

    ZOHO.embeddedApp.init();
  }, []);

  useEffect(() => {
    // get all data
    if (initialized) {
      const fetchData = async () => {
        const recordResp = await ZOHO.CRM.API.getRecord({
          Entity: entity,
          approved: "both",
          RecordID: entityId,
        });
        setRecordData(recordResp?.data?.[0]);
      };

      fetchData();
    }
  }, [initialized]);

  const preferedGraphicApplicationOptions = [
    "Screen Printing",
    "Embroidery",
    "Direct-to-Garment",
    "Heat-Transfer-Vinyl",
    "Sublimation",
    "Signs",
    "Engraving",
    "Direct-to-Film",
    "Stickers",
    "Decals",
    "Banners",
    "Business Cards",
    "Stationery",
    "Graphic Design",
    "Other",
  ];

  const yesNoOptions = ["Yes", "No"];

  const graphicFormatOptions = [
    "JPEG",
    "PNG",
    "SVG (Vector)",
    "TIFF",
    "PDF",
    "PSD",
    "BMP",
    "AI",
    "GIF",
    "WebP",
    "RAW",
    "I Don’t Know",
    "Other",
  ];

  const areGraphicsReady = watch("areGraphicsReady", false);

  const customDate = (date) => {
    const dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    return `${year}-${month + 1}-${day < 10 ? `0${day}` : day}`;
  };

  function hexToText(hex) {
    var result = "";
    for (var i = 0; i < hex.length; i += 2) {
      result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return result;
  }

  // Example usage
  var newLine = hexToText("0A");

  const onsubmit = async (data) => {
    console.log(data);
    const response = await ZOHO.CRM.API.addNotes({
      Entity: entity,
      RecordID: entityId,
      Title: "Deal Onboarding Form",
      Content:
        "CONTACT INFO" +
          newLine +
          newLine +
          "Account Name: " +
          data?.accountName +
          newLine +
          newLine +
          "Contact Name: " +
          data?.contactName +
          newLine +
          newLine +
          "Contact Phone: " +
          data?.contactPhone +
          newLine +
          newLine +
          "Contact Email: " +
          data?.contactEmail +
          newLine +
          newLine +
          "Deal Name: " +
          data?.dealName +
          newLine +
          newLine +
          newLine +
          "GRAPHIC INFO" +
          newLine +
          newLine +
          "Graphic(s) Description: " +
          data?.graphicDescription ||
        "" +
          newLine +
          newLine +
          "Preferred graphic application if any: " +
          data?.preferedGraphicApplication?.join(", ") +
          newLine +
          newLine +
          "Are graphics ready?: " +
          data?.areGraphicsReady +
          newLine +
          newLine +
          "Current graphic format(s): " +
          data?.currentGraphicFormat?.join(", ") +
          newLine +
          newLine +
          `${
            isOtherSelected &&
            "Describe what other format the client uses: " +
              data?.otherOption +
              newLine +
              newLine
          }` +
          "If we are doing (or re-doing) the graphics, graphic fees may apply (fees range from $30 for basic graphic manipulation to $150 for full logo design). Customer acknowledged?: " +
          data?.customerAcknowledged +
          newLine +
          newLine +
          "Number of colors in graphic: " +
          data?.numberOfColors +
          newLine +
          newLine +
          "Fonts used in graphic: " +
          data?.fontsUsedInGraphic +
          newLine +
          newLine +
          "Color of PANTONES, HEX, RGB, CMYK or equivalent: " +
          data?.colorOfPantones +
          newLine +
          newLine +
          "Thread color for embroidery: " +
          data?.threadColor +
          newLine +
          newLine +
          "Number of placements: " +
          data?.numberOfPlacements +
          newLine +
          newLine +
          "Specific placements and dimensions: " +
          data?.specificPlacements +
          newLine +
          newLine +
          newLine +
          "GARMENT INFO (IF GARMENTS ARE PROVIDED BY US)" +
          newLine +
          newLine +
          "Are we providing the garments?: " +
          data?.areWeProvidingGarments +
          newLine +
          newLine +
          "Types (brand and style) of garments: " +
          data?.typeOfGarments +
          newLine +
          newLine +
          "Size(s) and color(s) of garments: " +
          data?.sizeAndColorOfGarments +
          newLine +
          newLine +
          newLine +
          "TURNAROUND TIME" +
          newLine +
          newLine +
          "Due Date: " +
          customDate(data?.Due_Date) +
          newLine +
          newLine +
          "Rush orders with deadlines under 2 weeks can incur a rush fee. Customer acknowledged?: " +
          data?.rushOrdersWithDeadline +
          newLine +
          newLine +
          "10 - 14 business days from point of mockup approval for typical turnaround time. Deadlines can be affected by garment availability, shipping delays, etc. Customer acknowledged?: " +
          data?.deadlinesAffected +
          newLine +
          newLine +
          "Typical mockup turnaround time is 24-48 hours (excluding weekends). Customer acknowledged?: " +
          data?.typicalMockup +
          newLine +
          newLine +
          "Supplies / Materials Needed for Deal: " +
          data?.suppliesAndMaterialsNeeded +
          newLine +
          newLine +
          newLine +
          "OTHER INFORMATION" +
          newLine +
          newLine +
          "Special Instruction: " +
          data?.specialInstructions ||
        "",
    });
    if (response?.data?.[0]?.code) {
      ZOHO.CRM.UI.Popup.closeReload();
    }
  };

  if (recordData) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            pt: "1rem",
            pb: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Deal Onboarding Form
        </Typography>

        <Typography
          variant="p"
          sx={{
            pt: "1rem",
            pb: "2rem",
            fontSize: "1.2rem",
            fontWeight: "bold",
            pl: "10%",
          }}
        >
          CONTACT INFO
        </Typography>

        <Box
          sx={{
            width: "80%",
            height: "100%",
            pl: "10%",
            pr: "10%",
            pt: "1rem",
          }}
          component="form"
          onSubmit={handleSubmit(onsubmit)}
        >
          <Controller
            control={control}
            name="accountName"
            rules={{ required: true }}
            defaultValue={recordData?.Account_Name?.name}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Account Name
                </FormLabel>
                <TextField
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="accountName"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["accountName"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="contactName"
            rules={{ required: true }}
            defaultValue={recordData?.Contact_Name?.name}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Contact Name
                </FormLabel>
                <TextField
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="contactName"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["contactName"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="contactPhone"
            rules={{ required: true }}
            defaultValue={recordData?.Contact_Phone || ""}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Contact Phone
                </FormLabel>
                <TextField
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="contactPhone"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["contactPhone"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="contactEmail"
            rules={{ required: true }}
            defaultValue={recordData?.Contact_Email || ""}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Contact Email
                </FormLabel>
                <TextField
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="contactEmail"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["contactEmail"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="dealName"
            rules={{ required: true }}
            defaultValue={recordData?.Deal_Name || ""}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Deal Name
                </FormLabel>
                <TextField
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="dealName"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["dealName"]}
                />
              </>
            )}
          />

          <Typography
            variant="p"
            sx={{
              pt: "1rem",
              pb: "1.2rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "block",
            }}
          >
            GRAPHIC INFO
          </Typography>

          <Controller
            control={control}
            name="graphicDescription"
            defaultValue=""
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Graphic(s) Description
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="graphicDescription"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="preferedGraphicApplication"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Preferred graphic application if any
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="size-small-outlined-multi"
                  size="small"
                  options={preferedGraphicApplicationOptions}
                  getOptionLabel={(option) => option}
                  multiple
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["preferedGraphicApplication"]}
                    />
                  )}
                />
              </>
            )}
          />

          <Box>
            <Controller
              name="areGraphicsReady"
              control={control}
              defaultValue={false} // Set the default value of the checkbox
              render={({ field }) => (
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="Are graphics ready?"
                  />
                </FormGroup>
              )}
            />
          </Box>

          {areGraphicsReady && (
            <Typography sx={{ mb: "1rem" }}>
              Have potential client send all graphics, logos and pertinent info
              to your email directly, or to our company email:
              theprintplugofidaho@gmail.com
            </Typography>
          )}

          <Controller
            control={control}
            name="currentGraphicFormat"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Current graphic format(s)
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="currentGraphicFormat"
                  size="small"
                  options={graphicFormatOptions}
                  getOptionLabel={(option) => option}
                  multiple
                  onChange={(_, data) => {
                    setIsOtherSelected(data.includes("Other"));
                    field.onChange(data);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["currentGraphicFormat"]}
                    />
                  )}
                />
              </>
            )}
          />

          {isOtherSelected && (
            <Controller
              control={control}
              name="otherOption"
              rules={{ required: true }}
              defaultValue={""}
              render={({ field }) => (
                <>
                  <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                    Describe what other format the client uses
                  </FormLabel>
                  <TextField
                    inputProps={{
                      style: {
                        padding: "5px 10px",
                        margin: "2px 8px",
                      },
                    }}
                    id="otherOption"
                    variant="outlined"
                    fullWidth
                    {...field}
                    sx={{ mb: "1rem", mt: "5px" }}
                    error={errors["otherOption"]}
                  />
                </>
              )}
            />
          )}

          <Controller
            control={control}
            name="customerAcknowledged"
            rules={{ required: true }}
            defaultValue={"No"}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  If we are doing (or re-doing) the graphics, graphic fees may
                  apply (fees range from $30 for basic graphic manipulation to
                  $150 for full logo design). Customer acknowledged?
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="customerAcknowledged"
                  size="small"
                  options={yesNoOptions}
                  getOptionLabel={(option) => option}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["customerAcknowledged"]}
                    />
                  )}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="numberOfColors"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Number of colors in graphic
                </FormLabel>
                <TextField
                  type="number"
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="numberOfColors"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["numberOfColors"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="fontsUsedInGraphic"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Fonts used in graphic
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="fontsUsedInGraphic"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["fontsUsedInGraphic"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="colorOfPantones"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Color of PANTONES, HEX, RGB, CMYK or equivalent
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="colorOfPantones"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["colorOfPantones"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="threadColor"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Thread color for embroidery
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="threadColor"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["threadColor"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="numberOfPlacements"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Number of placements
                </FormLabel>
                <TextField
                  type="number"
                  inputProps={{
                    style: {
                      padding: "5px 10px",
                      margin: "2px 8px",
                    },
                  }}
                  id="numberOfPlacements"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["numberOfPlacements"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="specificPlacements"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Specific placements and dimensions
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="specificPlacements"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["specificPlacements"]}
                />
              </>
            )}
          />

          <Typography
            variant="p"
            sx={{
              pt: "1rem",
              pb: "1.2rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "block",
            }}
          >
            GARMENT INFO (IF GARMENTS ARE PROVIDED BY US)
          </Typography>

          <Controller
            control={control}
            name="areWeProvidingGarments"
            rules={{ required: true }}
            defaultValue={"No"}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Are we providing the garments?
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="areWeProvidingGarments"
                  size="small"
                  options={yesNoOptions}
                  getOptionLabel={(option) => option}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["areWeProvidingGarments"]}
                    />
                  )}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="typeOfGarments"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Types (brand and style) of garments
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="typeOfGarments"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["typeOfGarments"]}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="sizeAndColorOfGarments"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Size(s) and color(s) of garments
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="sizeAndColorOfGarments"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["sizeAndColorOfGarments"]}
                />
              </>
            )}
          />

          <Typography sx={{ fontSize: "14px", mb: "1rem" }}>
            *Confirm availability of requested items. Item availability can not
            be guaranteed. Prompt halfdown payment of the invoice is the best
            way to try and get items, but even then can’t guarantee availability
            as the industry moves fast.
          </Typography>

          <Typography
            variant="p"
            sx={{
              pb: "1.2rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "block",
            }}
          >
            TURNAROUND TIME
          </Typography>

          <Box sx={{ mb: "1rem" }}>
            <FormLabel
              id="date"
              sx={{ mb: "10px", color: "black", display: "block" }}
            >
              Due Date
            </FormLabel>
            <Controller
              name="Due_Date"
              control={control}
              // defaultValue={customDate(new Date())}
              rules={{ required: true }}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(newValue) =>
                      field.onChange(dayjs(newValue).format("YYYY/MM/DD"))
                    }
                    {...field}
                    renderInput={(params) => (
                      <TextField
                        id="date"
                        variant="outlined"
                        type="date"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "2.3rem !important",
                          },
                        }}
                        {...params}
                        error={errors["Due_Date"]}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>

          <Controller
            control={control}
            name="rushOrdersWithDeadline"
            rules={{ required: true }}
            defaultValue={"No"}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Rush orders with deadlines under 2 weeks can incur a rush fee.
                  Customer acknowledged?
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="rushOrdersWithDeadline"
                  size="small"
                  options={yesNoOptions}
                  getOptionLabel={(option) => option}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["rushOrdersWithDeadline"]}
                    />
                  )}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="deadlinesAffected"
            rules={{ required: true }}
            defaultValue={"No"}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  10 - 14 business days from point of mockup approval for
                  typical turnaround time. Deadlines can be affected by garment
                  availability, shipping delays, etc. Customer acknowledged?
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="deadlinesAffected"
                  size="small"
                  options={yesNoOptions}
                  getOptionLabel={(option) => option}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["deadlinesAffected"]}
                    />
                  )}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="typicalMockup"
            rules={{ required: true }}
            defaultValue={"No"}
            render={({ field }) => (
              <>
                <FormLabel id="name" sx={{ mb: "10px", color: "black" }}>
                  Typical mockup turnaround time is 24-48 hours (excluding
                  weekends). Customer acknowledged?
                </FormLabel>
                <Autocomplete
                  {...field}
                  id="typicalMockup"
                  size="small"
                  options={yesNoOptions}
                  getOptionLabel={(option) => option}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "5px" }}
                      error={errors["typicalMockup"]}
                    />
                  )}
                />
              </>
            )}
          />

          <Controller
            control={control}
            name="suppliesAndMaterialsNeeded"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Supplies / Materials Needed for Deal
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="suppliesAndMaterialsNeeded"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                  error={errors["suppliesAndMaterialsNeeded"]}
                />
              </>
            )}
          />

          <Typography
            variant="p"
            sx={{
              pb: "1.2rem",
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "block",
              mt: 2,
            }}
          >
            OTHER INFORMATION
          </Typography>

          <Typography sx={{ fontSize: "14px", mb: "1rem" }}>
            Enter any other information necessary for the job.
          </Typography>

          <Controller
            control={control}
            name="specialInstructions"
            defaultValue=""
            render={({ field }) => (
              <>
                <FormLabel
                  id="name"
                  sx={{ mb: "10px", mt: "16px", color: "black" }}
                >
                  Special Instructions
                </FormLabel>
                <TextField
                  multiline
                  rows={3}
                  id="specialInstructions"
                  variant="outlined"
                  fullWidth
                  {...field}
                  sx={{ mb: "1rem", mt: "5px" }}
                />
              </>
            )}
          />
        </Box>

        <Box
          sx={{
            m: "1rem 0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Button
            onClick={() => {
              ZOHO.CRM.UI.Popup.close();
            }}
            variant="outlined"
          >
            Cancel
          </Button>

          <LoadingButton
            variant="contained"
            type="submit"
            loadingPosition="start"
            // loading={addCardLoading}
            onClick={handleSubmit(onsubmit)}
          >
            Submit Form
          </LoadingButton>
        </Box>
      </Box>
    );
  }
}

export default App;
