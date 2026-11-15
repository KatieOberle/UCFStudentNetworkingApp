import 'package:flutter/material.dart';
import 'report_user_page.dart';
/// Student details supplied by the Search page.
class Student {
  final String id;
  final String firstName;
  final String lastName;
  final String major;
  final int? graduationYear;
  final List<String> careerInterests;
  final List<String> companies;
  final String bio;
  final String? contactEmail;
  final String? linkedIn;

  const Student({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.major = '',
    this.graduationYear,
    this.careerInterests = const [],
    this.companies = const [],
    this.bio = '',
    this.contactEmail,
    this.linkedIn,
  });
}

class StudentProfilePage extends StatefulWidget {
  final Student? student;
  final VoidCallback? onBackClick;
  final Future<void> Function(String studentId)? onConnect;
  final void Function(Student student)? onReportClick;

  const StudentProfilePage({
    super.key,
    required this.student,
    this.onBackClick,
    this.onConnect,
    this.onReportClick,
  });

  @override
  State<StudentProfilePage> createState() => _StudentProfilePageState();
}

class _StudentProfilePageState extends State<StudentProfilePage> {
  String error = '';
  String message = '';
  bool connecting = false;

  void _goBack() {
    if (widget.onBackClick != null) {
      widget.onBackClick!();
    } else {
      Navigator.of(context).maybePop();
    }
  }

  Future<void> _handleConnect() async {
    final student = widget.student;
    if (student == null) return;

    setState(() {
      error = '';
      message = '';
    });

    if (widget.onConnect == null) {
      setState(() => error = 'Connection requests are not connected to the server yet.');
      return;
    }

    setState(() => connecting = true);
    try {
      await widget.onConnect!(student.id);
      if (!mounted) return;
      setState(() => message = 'Connection request sent.');
    } catch (_) {
      if (!mounted) return;
      setState(() => error = 'Unable to send connection request. Please try again.');
    } finally {
      if (mounted) setState(() => connecting = false);
    }
  }

  void _handleReport() {
  final student = widget.student;
  if (student == null) return;

  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => ReportUserPage(
        student: ReportStudent(
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
        ),
        onBackClick: () => Navigator.pop(context),
      ),
    ),
  );
}

  Widget _detailCard(BuildContext context, String heading, Widget content) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(heading, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            content,
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final student = widget.student;
    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        actions: [
          TextButton(onPressed: _goBack, child: const Text('Back to Search')),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1000),
            child: student == null
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Student Profile', style: Theme.of(context).textTheme.headlineMedium),
                      const SizedBox(height: 12),
                      const Text('No student selected.'),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${student.firstName} ${student.lastName}'.trim(),
                          style: Theme.of(context).textTheme.headlineMedium),
                      const SizedBox(height: 8),
                      const Text('UCF Student Profile'),
                      const SizedBox(height: 20),
                      Wrap(
                        spacing: 12,
                        runSpacing: 8,
                        children: [
                          FilledButton(
                            onPressed: connecting ? null : _handleConnect,
                            child: Text(connecting ? 'Sending...' : 'Connect'),
                          ),
                          OutlinedButton(
                            onPressed: _handleReport,
                            child: const Text('Report User'),
                          ),
                        ],
                      ),
                      if (error.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Text(error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                      ],
                      if (message.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Text(message, style: const TextStyle(color: Colors.greenAccent)),
                      ],
                      const SizedBox(height: 24),
                      LayoutBuilder(
                        builder: (context, constraints) {
                          final cardWidth = constraints.maxWidth >= 650
                              ? (constraints.maxWidth - 16) / 2
                              : constraints.maxWidth;
                          return Wrap(
                            spacing: 16,
                            runSpacing: 16,
                            children: [
                              SizedBox(width: cardWidth, child: _detailCard(context, 'Major', Text(student.major.isEmpty ? 'Not provided' : student.major))),
                              SizedBox(width: cardWidth, child: _detailCard(context, 'Graduation Year', Text(student.graduationYear?.toString() ?? 'Not provided'))),
                              SizedBox(width: cardWidth, child: _detailCard(context, 'Career Interests', Text(student.careerInterests.isEmpty ? 'Not provided' : student.careerInterests.join(', ')))),
                              SizedBox(width: cardWidth, child: _detailCard(context, 'Company Affiliations', Text(student.companies.isEmpty ? 'Not provided' : student.companies.join(', ')))),
                              SizedBox(width: cardWidth, child: _detailCard(context, 'About', Text(student.bio.isEmpty ? 'No bio provided.' : student.bio))),
                              SizedBox(
                                width: cardWidth,
                                child: _detailCard(
                                  context,
                                  'Contact Information',
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(student.contactEmail?.isNotEmpty == true ? 'Email: ${student.contactEmail}' : 'No email provided.'),
                                      if (student.linkedIn?.isNotEmpty == true) ...[
                                        const SizedBox(height: 8),
                                        SelectableText('LinkedIn: ${student.linkedIn}'),
                                      ],
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
