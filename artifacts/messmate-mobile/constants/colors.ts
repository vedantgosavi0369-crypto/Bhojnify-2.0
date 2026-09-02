/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // A warm campus-kitchen palette: grounded, optimistic, and easy to scan.
    text: '#17352B',
    tint: '#1D7A58',

    background: '#F7F4EC',
    foreground: '#17352B',

    card: '#FFFCF5',
    cardForeground: '#17352B',

    primary: '#1D7A58',
    primaryForeground: '#FFFDF7',

    secondary: '#E7EFE6',
    secondaryForeground: '#24523E',

    muted: '#EDE8DB',
    mutedForeground: '#738078',

    accent: '#F4C95D',
    accentForeground: '#5D4613',

    destructive: '#C85545',
    destructiveForeground: '#FFFDF7',

    border: '#D9D8C9',
    input: '#D2D8CE',
  },

  dark: {
    text: '#F3F2E9',
    tint: '#82D0A8',
    background: '#12211A',
    foreground: '#F3F2E9',
    card: '#1A3025',
    cardForeground: '#F3F2E9',
    primary: '#82D0A8',
    primaryForeground: '#12211A',
    secondary: '#274436',
    secondaryForeground: '#DCEFE2',
    muted: '#24362D',
    mutedForeground: '#A6B8AC',
    accent: '#E7B947',
    accentForeground: '#3C2D0B',
    destructive: '#EA8574',
    destructiveForeground: '#24110E',
    border: '#355140',
    input: '#3C5A48',
  },

  radius: 18,
};

export default colors;
