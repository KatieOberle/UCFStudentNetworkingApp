import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'pages/login_page.dart';
import 'pages/home_page.dart';

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
          seedColor: const Color(0xFF561787), // same purple as the web app
          brightness: Brightness.dark,
        ),
      ),
      home: const HomePage(token: ''), // TEMPORARY: restore LoginPage() before committing
    );
  }
}


// Shared helpers kept in main.dart (original implementations)

// Address of our Express backend.
// Browser (Chrome/Firefox) or iOS simulator: localhost works.
// Android emulator: change this to 'http://10.0.2.2:5000'.
const String apiBase = 'http://localhost:5000';

/// Sends a POST request with a JSON body to the backend and returns the
/// JSON response. Our backend replies with { error: "..." } when something
/// goes wrong, so the pages check that field instead of the status code.
Future<Map<String, dynamic>> postJson(
    String path, Map<String, String> body) async {
  final response = await http.post(
    Uri.parse('$apiBase$path'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(body),
  );
  return jsonDecode(response.body) as Map<String, dynamic>;
}

/// Reads the user's first name out of the JWT the backend returns on login.
/// A JWT is three base64 parts separated by dots; the middle one holds the data.
String firstNameFromToken(String token) {
  try {
    final payload = token.split('.')[1];
    final decoded = utf8.decode(base64Url.decode(base64Url.normalize(payload)));
    final data = jsonDecode(decoded) as Map<String, dynamic>;
    return data['firstName']?.toString() ?? '';
  } catch (_) {
    return '';
  }
}


/// Centered, scrollable column used by every page so they look the same.
Widget pageLayout(BuildContext context, String title, List<Widget> children) {
  return Scaffold(
    appBar: AppBar(title: const Text('KnightLink')),
    body: Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(title, style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 24),
              ...children,
            ],
          ),
        ),
      ),
    ),
  );
}

/// A labeled text box.
Widget textField(TextEditingController controller, String label,
    {bool obscure = false}) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: TextField(
      controller: controller,
      obscureText: obscure,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
    ),
  );
}

/// Shows an error in red or a success message in green.
Widget statusMessage(BuildContext context, String message, bool isError) {
  if (message.isEmpty) return const SizedBox.shrink();
  return Padding(
    padding: const EdgeInsets.only(top: 12),
    child: Text(
      message,
      style: TextStyle(
        color: isError
            ? Theme.of(context).colorScheme.error
            : Colors.greenAccent,
      ),
    ),
  );
}

