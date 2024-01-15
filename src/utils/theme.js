import {extendTheme} from "@chakra-ui/react";

// Color mode config
const config = {
    initialColorMode: "light",
    useSystemColorMode: false,
  };

const theme = extendTheme({
    fonts: {
        body: "Roboto Slab, serif",
        heading: "Roboto Slab, serif",
    },
    colors: {
        button_gradient: "linear-gradient(97.73deg, #ab333e 0%, #f0555d 100%)",
        button_gradient_light: "linear-gradient(97deg, rgba(167,29,41,1) 0%, rgba(177,62,68,1) 100%)",
        background_gradient_1: "linear-gradient(242.01deg, #fdf0f0 6.33%, #f4f0fd 43.96%, #f0f8fd 82.55%)",
        background_grdient_2: "linear-gradient(242.01deg, #fddcdc 6.33%, #e9dfff 43.96%, #e1f4ff 82.55%)",
        brand_pink: {
          900: "#EB6B6B",
          100: "#F1E8ED",
        },
        brand_red: {
          900: "#ab333e",
          500: "#f0555d",
        },
      },
      components: {
        Button: {
          baseStyle: {
            fontWeight: "bold",
          },
        },
        Heading: {
          baseStyle: {
            color: "black",
          },
        },
      },
      config
      
});

export default theme;