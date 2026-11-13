import 'package:flutter/material.dart';
import '../main.dart' show postJson, firstNameFromToken, pageLayout, textField, statusMessage;

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

