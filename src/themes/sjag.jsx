import { createTheme } from "@mui/material/styles";

const generateButtonCSS = props => {
  const { theme } = props;
  let cssProps = {
    borderRadius: "20px",
    textTransform: "capitalize",
    padding: "0 16px",
    height: "40px",
  };

  // Variant
  switch (props.ownerState.variant) {
    case "contained":
      cssProps = {
        ...cssProps,
        fontWeight: "400",
        lineHeight: "26px",
        letterSpacing: "0.46px",
        backgroundColor: theme.palette.primary.dark,
        "&:hover": {
          backgroundColor:
            theme.palette.custom[props.ownerState.color].containedHover,
        },
      };
      break;
    case "outlined":
      cssProps = {
        ...cssProps,
        color: theme.palette.text.secondary,
        fontWeight: "400",
        lineHeight: "26px",
        letterSpacing: "0.46px",
        border: "1px solid rgba(63, 81, 181, 0.5)",
      };
      break;
    case "text":
      cssProps = {
        ...cssProps,
        fontWeight: "400",
        lineHeight: "26px",
        letterSpacing: "0.46px",
        color: theme.palette.primary.dark,
      };
      break;

    default:
      break;
  }

  // Size
  switch (props.ownerState.state) {
    case "large":
      break;
    case "medium":
      break;
    case "small":
      break;

    default:
      break;
  }
  return cssProps;
};

const generateFABCSS = props => {
  const { theme } = props;
  let cssProps = {
    width: "40px",
    height: "40px",
    borderRadius: "16px",
    textTransform: "none",
  };

  // Variant
  switch (props.ownerState.variant) {
    case "contained":
      cssProps = {
        ...cssProps,
        background: props.theme.palette.primary.main,
        color: "#fff",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: props.theme.palette.primary.dark,
        },
      };
      break;
    case "outlined":
      cssProps = {
        ...cssProps,

        color: "rgba(43, 43, 43, 0.6)",
        boxShadow: "none",
        ...theme.unstable_sx({
          backgroundColor: { xs: "#EBF8FF", md: "transparent" },
        }),
        backgroundColor: props.ownerState.isSmallScreen
          ? "#EBF8FF"
          : "transparent",
      };
      break;
    case "selected":
      cssProps = {
        ...cssProps,
        background: "linear-gradient(39.53deg, #2A33FF 25.38%, #00C2FF 98.57%)",
      };
      break;
    case "unboxed":
      cssProps = {
        ...cssProps,

        color: "rgba(43, 43, 43, 0.6)",
        boxShadow: "none",
        backgroundColor: "transparent",
      };
      break;

    default:
      break;
  }

  // Size
  switch (props.ownerState.state) {
    case "large":
      break;
    case "medium":
      break;
    case "small":
      break;

    default:
      break;
  }
  return cssProps;
};

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0ABBF3",
      dark: "#0098EA",
      light: "#CCDFFB" /* #0400CE */,
      contrastText: "#fff",
    },
    secondary: {
      main: "#FF2D2D",
      dark: "#B5A7FF",
      light: "#4502D3",
      contrast: "#FFFFFF",
      contrastText: "#FFFFFF",
    },
    gradient: {
      main: "linear-gradient(39.53deg, #2A33FF 25.38%, #00C2FF 98.57%)",
    },
    text: {
      primary: "rgba(19, 39, 46, 0.8)",
      secondary: "rgba(43, 43, 43, 0.6)",
      disabled: "rgba(43, 43, 43, 0.38)",
    },
    action: {
      active: "#0098EA",
      hover: "rgba(204, 223, 251, 0.3)",
      selected: "rgba(0, 0, 0, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      focus: "rgba(0, 0, 0, 0.12)",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    error: {
      main: "#FF594D",
      dark: "#C40E00",
      light: "#FFC2C2",
      contrastText: "#FFFFFF",
      secondary: "#CC4D64",
    },
    info: {
      main: "#00C2FF",
      dark: "#007DD8",
      light: "#75DEFF",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFB800",
      dark: "#EA8324",
      light: "#FFE34D",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#35C75E",
      dark: "#008826",
      light: "#9FF9B3",
      contrastText: "#FFFFFF",
    },
    background: {
      paper: "#FFFFFF",
      default: "#EBF8FF",
      backgroundBar: "#F6F6F6",
    },
    custom: {
      primary: {
        containedHover: "#2c397f",
        outlinedHover: "rgba(63, 81, 181, 0.08)",
        outlinedResting: "rgba(63, 81, 181, 0.50)",
      },
    },
    other: {
      outlinedBorder: "rgba(0, 0, 0, 0.23)",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1200,
      xl: 1400,
    },
  },
  typography: {
    fontFamily: "Inter",
    h1: {
      fontSize: "96px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "112px",
    },
    h2: {
      fontSize: "60px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "72px",
    },
    h3: {
      fontSize: "48px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "56px",
    },
    h4: {
      fontSize: "34px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "110%",
    },
    h5: {
      fontSize: "24px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "26px",
    },
    h6: {
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "32px",
      letterSpacing: "0.15px",
    },
    subtitle1: {
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "24px",
      letterSpacing: "0.15px",
    },
    subtitle2: {
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "22px",
      letterSpacing: "0.1px",
    },
    body1: {
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "19px",
      letterSpacing: "0.15px",
    },
    body2: {
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "120%",
      letterSpacing: "0.15px",
    },
    caption: {
      // color: "rgba(43, 43, 43, 0.6)",
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "14px",
      letterSpacing: "0.4px",
    },
    overline: {
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "32px",
      letterSpacing: "1px",
      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
      textTransform: "uppercase",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: () => {
          return {
            paddingRight: "0px !important",
          };
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: () => () => {
          return {
            transition: "var(--trans)",
            opacity: "0.8 !important",
          };
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: props => generateButtonCSS(props),
      },
      variants: [
        {
          props: { variant: "short-cuts" },
          style: {
            /* Background/Paper */
            background: "#FFFFFF",
            color: "#0098EA",
            "&:hover": {
              background: "#0098EA",
              color: "#FFFFFF",
            },
          },
        },
      ],
    },
    MuiFab: {
      styleOverrides: {
        root: props => generateFABCSS(props),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: () => () => {
          return {
            "&.project-status": {
              border: "none",
              textTransform: "uppercase",
            },

            "& .MuiChip-label": {
              paddingLeft: "4px",
              fontSize: "10px",
            },
          };
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: () => () => {
          return {
            marginTop: "8px",
            "&.MuiInputBase-adornedEnd": {
              paddingRight: "12px",
            },
          };
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        shrink: { fontSize: "16px !important" },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          padding: "0px",
        },
        label: {
          fontSize: "12px !important",
          color: "rgba(43,43,43,0.6)",
          marginTop: "8px",
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: () => () => {
          return {
            marginLeft: "0px",
            // Use existing space / prevents shifting content below field
            marginTop: 0,
            height: 0,
          };
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
        icon: {
          strokeWidth: "1px",
          path: {
            stroke: "#666666",
            color: "#666666",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        ul: { justifyContent: "right", paddingTop: "20px" },
      },
    },

    MuiCard: {
      variants: [
        {
          props: { variant: "project-card" },
          style: {
            /* Background/Paper */
            background: "#FFFFFF",
            /* Elevation/Outlined */
            boxShadow: "0px 0px 0px 1px #E0E0E0",
            borderRadius: "16px",
          },
        },
      ],
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          alignItems: "flex-start",
        },
        avatar: {
          marginRight: "8px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0px 16px 16px",
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          "&:hover": {
            // you want this to be the same as the backgroundColor above
            backgroundColor: "#FFF",
          },
        },
        focusHighlight: {
          background: "transparent",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          zIndex: 2000,
        },
        paper: {
          borderRadius: "16px",
          background: "white",
          boxShadow:
            "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: props => {
          return {
            "& .MuiListItemIcon-root .material-symbols-outlined": {
              color: "#414244!important",
            },
            "&:hover": {
              "& .MuiListItemText-root": {
                color: props.theme.palette.primary.dark,
              },
              "& .MuiListItemIcon-root .material-symbols-outlined": {
                color: `${props.theme.palette.primary.dark} !important`,
                "& .MuiSvgIcon-root": {
                  "& path": {
                    fill: props.theme.palette.primary.main,
                    fillOpacity: 1,
                  },
                },
              },
            },
          };
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          display: "block",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgba(43, 43, 43, 0.54)",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(204, 223, 251, 1)",
          height: "8px",
          borderRadius: "10px",
          "& .MuiLinearProgress-bar1Determinate": {
            backgroundColor: "#0098EA",
            borderRadius: "10px",
          },
        },
      },
    },
    DialogTitle: {
      styleOverrides: {
        root: {
          fontSize: { xs: "20px", md: "22px" },
          fontWeight: "600",
          padding: "24px",
        },
      },
    },
    DialogContent: {
      styleOverrides: {
        root: { padding: "24px" },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: "8px 24px", borderTop: "1px solid rgba(0,0,0,0.1)" },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "transparent",
          "&.Mui-expanded": { margin: 0 },
          "&:before": { content: "initial" },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: "0",
          "&.Mui-expanded": {
            minHeight: 0,
          },
          "& .MuiAccordionSummary-content": {
            margin: "13px 0",
            "&.Mui-expanded": {
              margin: "13px 0",
            },
          },
          "& .MuiAccordionSummary-expandIconWrapper": {
            flex: "0 0 40px",
            justifyContent: "center",
            "& .MuiSvgIcon-root": {
              width: "16px",
            },
          },
          "& h6": {
            fontWeight: "500",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: { padding: "7px 0 24px" },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: { padding: "7px 22px" },
      },
    },
  },
});

const sjagTheme = createTheme(theme, {
  typography: {
    subtitle1: {
      color: theme.palette.text.primary,
    },
    // h1: {
    //   "@media (min-width:600px)": {
    //     fontSize: "1.5rem",
    //   },
    //   [theme.breakpoints.up("md")]: {
    //     fontSize: "2.4rem",
    //   },
    // },
  },
  components: {
    MuiTablePagination: {
      styleOverrides: {
        input: { marginTop: "0px !important" },
      },
    },
  },
});

export default sjagTheme;
