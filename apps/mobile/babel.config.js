module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@shared': '../../src',
            // Redirect any web supabaseClient imports from shared modules to the mobile adapter
            '../../src/supabaseClient': './src/lib/supabaseClient',
            '../supabaseClient': './src/lib/supabaseClient',
            '../../src/supabaseAuth': './src/lib/supabaseAuth',
            '../supabaseAuth': './src/lib/supabaseAuth'
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
