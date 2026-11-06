import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// Address of our Express backend.
// Browser (Chrome/Firefox) or iOS simulator: localhost works.
// Android emulator: change this to 'http://10.0.2.2:5000'.
const String apiBase = 'http://localhost:5000';

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
      home: const LoginPage(),
    );
  }
}

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Shared UI pieces
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Login page: POST /api/auth/login { email, password }
// ---------------------------------------------------------------------------

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  String _message = '';
  bool _loading = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final email = _email.text.trim();
    final password = _password.text;

    if (email.isEmpty || password.isEmpty) {
      setState(() => _message = 'Please enter your email and password.');
      return;
    }

    setState(() {
      _loading = true;
      _message = '';
    });

    try {
      final data = await postJson('/api/auth/login', {
        'email': email,
        'password': password,
      });
      if (!mounted) return;

      final token = data['accessToken'];
      if (token is String) {
        // Logged in: go to the home page and pass the token along.
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => HomePage(token: token)),
        );
        return;
      }

      setState(() {
        _loading = false;
        _message = data['error']?.toString() ?? 'Login failed.';
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _message = 'Could not reach the server. Is the backend running?';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return pageLayout(context, 'Log In', [
      textField(_email, 'UCF Email'),
      textField(_password, 'Password', obscure: true),
      const SizedBox(height: 4),
      FilledButton(
        onPressed: _loading ? null : _login,
        child: Text(_loading ? 'Logging in...' : 'Log In'),
      ),
      statusMessage(context, _message, true),
      const SizedBox(height: 8),
      TextButton(
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const RegisterPage()),
        ),
        child: const Text("Don't have an account? Sign up"),
      ),
    ]);
  }
}

// ---------------------------------------------------------------------------
// Register page: POST /api/auth/register { firstName, lastName, email, password }
// ---------------------------------------------------------------------------

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _firstName = TextEditingController();
  final _lastName = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  String _message = '';
  bool _isError = true;
  bool _loading = false;

  @override
  void dispose() {
    _firstName.dispose();
    _lastName.dispose();
    _email.dispose();
    _password.dispose();
    _confirm.dispose();
    super.dispose();
  }

  void _showError(String message) {
    setState(() {
      _isError = true;
      _message = message;
    });
  }

  Future<void> _register() async {
    final firstName = _firstName.text.trim();
    final lastName = _lastName.text.trim();
    final email = _email.text.trim();
    final password = _password.text;

    if (firstName.isEmpty ||
        lastName.isEmpty ||
        email.isEmpty ||
        password.isEmpty) {
      _showError('Please fill in every field.');
      return;
    }
    if (password != _confirm.text) {
      _showError('Passwords do not match.');
      return;
    }

    setState(() {
      _loading = true;
      _message = '';
    });

    try {
      final data = await postJson('/api/auth/register', {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
      });
      if (!mounted) return;

      // The backend sends { error: "" } on success and a message on failure.
      final error = data['error']?.toString() ?? '';
      setState(() {
        _loading = false;
        _isError = error.isNotEmpty;
        _message = error.isNotEmpty
            ? error
            : 'Account created! Check your UCF email for a verification link, then log in.';
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
      _showError('Could not reach the server. Is the backend running?');
    }
  }

  @override
  Widget build(BuildContext context) {
    return pageLayout(context, 'Create Account', [
      textField(_firstName, 'First Name'),
      textField(_lastName, 'Last Name'),
      textField(_email, 'UCF Email'),
      textField(_password, 'Password', obscure: true),
      textField(_confirm, 'Confirm Password', obscure: true),
      const SizedBox(height: 4),
      FilledButton(
        onPressed: _loading ? null : _register,
        child: Text(_loading ? 'Creating account...' : 'Sign Up'),
      ),
      statusMessage(context, _message, _isError),
      const SizedBox(height: 8),
      TextButton(
        onPressed: () => Navigator.of(context).pop(),
        child: const Text('Already have an account? Log in'),
      ),
    ]);
  }
}

// ---------------------------------------------------------------------------
// Home page: shown after a successful login
// ---------------------------------------------------------------------------

class HomePage extends StatelessWidget {
  const HomePage({super.key, required this.token});

  final String token;

  @override
  Widget build(BuildContext context) {
    final name = firstNameFromToken(token);
    return pageLayout(context, name.isEmpty ? 'Welcome!' : 'Welcome, $name!', [
      const Text('You are logged in to KnightLink.'),
      const SizedBox(height: 24),
      OutlinedButton(
        onPressed: () => Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginPage()),
        ),
        child: const Text('Log Out'),
      ),
    ]);
  }
}
