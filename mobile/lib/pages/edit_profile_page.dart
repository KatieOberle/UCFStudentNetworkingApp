import 'package:flutter/material.dart';

class ProfileData {
  final String firstName;
  final String lastName;
  final String major;
  final String careerInterests;
  final String contactInfo;
  final String companyAffiliations;

  const ProfileData({
    this.firstName = '',
    this.lastName = '',
    this.major = '',
    this.careerInterests = '',
    this.contactInfo = '',
    this.companyAffiliations = '',
  });
}

class EditProfilePage extends StatefulWidget {
  final VoidCallback? onBackClick;
  final ProfileData? initialProfile;
  final Future<void> Function(ProfileData profile)? onSave;

  const EditProfilePage({
    super.key,
    this.onBackClick,
    this.initialProfile,
    this.onSave,
  });

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  late final TextEditingController _firstName;
  late final TextEditingController _lastName;
  late final TextEditingController _major;
  late final TextEditingController _careerInterests;
  late final TextEditingController _contactInfo;
  late final TextEditingController _companyAffiliations;

  String _error = '';
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final profile = widget.initialProfile ?? const ProfileData();
    _firstName = TextEditingController(text: profile.firstName);
    _lastName = TextEditingController(text: profile.lastName);
    _major = TextEditingController(text: profile.major);
    _careerInterests = TextEditingController(text: profile.careerInterests);
    _contactInfo = TextEditingController(text: profile.contactInfo);
    _companyAffiliations = TextEditingController(text: profile.companyAffiliations);
  }

  @override
  void dispose() {
    _firstName.dispose();
    _lastName.dispose();
    _major.dispose();
    _careerInterests.dispose();
    _contactInfo.dispose();
    _companyAffiliations.dispose();
    super.dispose();
  }

  void _goBack() {
    if (widget.onBackClick != null) {
      widget.onBackClick!();
    } else {
      Navigator.of(context).pop();
    }
  }

  Future<void> _handleSubmit() async {
    if (_saving) return;
    setState(() => _error = '');

    if (_firstName.text.trim().isEmpty || _lastName.text.trim().isEmpty) {
      setState(() => _error = 'Please enter your first and last name.');
      return;
    }

    if (widget.onSave == null) {
      setState(() => _error = 'Profile saving is not connected to the server yet.');
      return;
    }

    final profile = ProfileData(
      firstName: _firstName.text,
      lastName: _lastName.text,
      major: _major.text,
      careerInterests: _careerInterests.text,
      contactInfo: _contactInfo.text,
      companyAffiliations: _companyAffiliations.text,
    );

    setState(() => _saving = true);
    try {
      await widget.onSave!(profile);
      if (!mounted) return;
      _goBack();
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to save your profile. Please try again.');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Widget _field(String label, TextEditingController controller,
      {int lines = 1, String? hint, bool required = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: TextField(
        controller: controller,
        maxLines: lines,
        decoration: InputDecoration(
          labelText: required ? '$label *' : label,
          hintText: hint,
          border: const OutlineInputBorder(),
          alignLabelWithHint: lines > 1,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        actions: [
          TextButton(
            onPressed: _goBack,
            child: const Text('Back to Profile'),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Edit Profile', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 12),
                const Text('Update your student information, career interests, and professional connections.'),
                const SizedBox(height: 32),
                _field('First Name', _firstName, required: true),
                _field('Last Name', _lastName, required: true),
                _field('Major', _major),
                _field('Career Interests', _careerInterests,
                    lines: 3, hint: 'Describe your career interests'),
                _field('Contact Information', _contactInfo,
                    hint: 'Professional email or contact link'),
                _field('Company Affiliations', _companyAffiliations,
                    lines: 3, hint: 'Internships, companies, or organizations'),
                if (_error.isNotEmpty) ...[
                  Text(_error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  const SizedBox(height: 16),
                ],
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: [
                    OutlinedButton(onPressed: _saving ? null : _goBack, child: const Text('Cancel')),
                    FilledButton(
                      onPressed: _saving ? null : _handleSubmit,
                      child: Text(_saving ? 'Saving...' : 'Save Changes'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
