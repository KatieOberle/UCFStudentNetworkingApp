import 'package:flutter/material.dart';
import 'pages/login_page.dart';

// Compatibility exports: existing pages importing main.dart keep working.
export 'services/api_service.dart';
export 'screens/shared_widgets.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KnightLink',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF561787),
          brightness: Brightness.dark,
        ),
      ),
      home: const LoginPage(),
    );
  }
}
