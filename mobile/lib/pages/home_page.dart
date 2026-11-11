import 'package:flutter/material.dart';
import '../main.dart' show postJson, firstNameFromToken, pageLayout, textField, statusMessage;
import 'login_page.dart';

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